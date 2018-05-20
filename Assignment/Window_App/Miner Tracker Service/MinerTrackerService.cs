using Miner_Tracker_Common.ConfigurationService;
using Miner_Tracker_Common.ManagementService;
using Miner_Tracker_Common.LogService;
using Miner_Tracker_Common.WCFService;
using System;
using Miner_Tracker_Common.NetworkService;
using System.ServiceModel.Description;
using System.ServiceProcess;
using System.Timers;
using Miner_Tracker_Common.Model.Monitoring;
using Miner_Tracker_Common.Model.Configuration;
using System.ServiceModel;
using Miner_Tracker_Common.Utils;
using System.IO;

namespace Miner_Tracker_Service
{
    public partial class MinerTrackerService : ServiceBase
    {
        private ServiceHost serviceHost = null;
        private Timer CheckTimer = null;
        private static Miner_Tracker_Common.Model.Configuration.ServiceConfiguration ServiceConfig = null;
        private static UserConfiguration UserConfig = null;
        public static bool IsConnected = true;
        public const long MAX_LOG_FILE_SIZE = 10; //MB
        public MinerTrackerService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            EventLogger.WriteLog("SERVICE", "Initializing...");
            #region ---Read and check configuration---
            ConfigurationReader config = new ConfigurationReader();

            ServiceConfig = config.GetServiceConfig();

            if (!ClassUtils.CheckNull(ServiceConfig))
            {
                EventLogger.WriteLog("CONFIG ERROR", "Unable to retrieve service configuration file. Exiting...");
                return;
            }
            #endregion

            #region --Check User Config---

            //Get User config
            var userConfigReader = new ConfigurationReader(isService: false, userConfigPath: ServiceConfig.UserConfigPath, userConfigFile: ServiceConfig.UserConfigFileName);
            UserConfiguration CurrentUserConfig = userConfigReader.GetUserConfig();
            //user.config has changed
            UserConfig = CurrentUserConfig;
            ConfigurationSaver configurationSaver = new ConfigurationSaver();

            if (!ClassUtils.CheckNull(CurrentUserConfig))
            {
                //Fill unknown fields of user config
                UserConfig = new UserConfiguration
                {
                    ID = CurrentUserConfig == null || CurrentUserConfig.ID == 0 ? ServiceConfig.UserID : CurrentUserConfig.ID,
                    LogPath = CurrentUserConfig == null || CurrentUserConfig.LogPath == null ? ServiceConfig.UserLogPath : CurrentUserConfig.LogPath,
                    OpenOnStartup = CurrentUserConfig == null || CurrentUserConfig.OpenOnStartup == null ? ServiceConfig.UserOpenOnStartup : CurrentUserConfig.OpenOnStartup,
                    CheckInterval = CurrentUserConfig == null || CurrentUserConfig.CheckInterval == null ? ServiceConfig.UserCheckInterval : CurrentUserConfig.CheckInterval,
                    MinimizedWhenClose = CurrentUserConfig == null || CurrentUserConfig.MinimizedWhenClose == null ? ServiceConfig.UserMinimizedWhenClose : CurrentUserConfig.MinimizedWhenClose,
                    PCID = CurrentUserConfig == null || CurrentUserConfig.PCID == null ? ServiceConfig.UserPCID : CurrentUserConfig.PCID,
                    PreviousPCID = CurrentUserConfig == null || CurrentUserConfig.PreviousPCID == null ? ServiceConfig.UserPCID : CurrentUserConfig.PreviousPCID
                };

                
                if (!configurationSaver.SaveUserConfiguration(UserConfig))
                {
                    EventLogger.WriteLog("SERVICE SAVE CLIENT CONFIG ERROR", "Error when save user configuration!");
                }
                EventLogger.WriteLog("SERVICE CREATED NEW CLIENT CONFIG", "");
            }
            #endregion


            #region --- Check NEW PCID ---
            if (!UserConfig.PCID.Equals(UserConfig.PreviousPCID))
            {
                var computerName = Environment.MachineName;
                var currentUser = Environment.UserName;
                var macAddress = MacAddress.GetFirstMacAddress();

                var PCID = UserConfig.PCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddress}" : UserConfig.PCID;
                var previousPCID = UserConfig.PreviousPCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddress}" : UserConfig.PreviousPCID;

                string address = ServiceConfig.ServerUpdateIDAddress.Replace("[oldname]", previousPCID).Replace("[newname]", PCID);
                var httpRespond = HttpRequest.SendPutRequest(address, "", ServiceConfig.UserID.ToString());

                if (httpRespond.ToLower().Contains("ok"))
                {
                    var backupPCID = UserConfig.PreviousPCID;
                    UserConfig.PreviousPCID = UserConfig.PCID;
                    if (!configurationSaver.SaveUserConfiguration(UserConfig))
                    {
                        UserConfig.PreviousPCID = backupPCID;
                        EventLogger.WriteLog("SERVICE SAVE CLIENT NEW PC ID ERROR", "Error when save user configuration!");
                    }
                    else
                        EventLogger.WriteLog("SERVICE UPDATED NEW CLIENT PC ID", "");
                }
                else
                {
                    UserConfig.PCID = UserConfig.PreviousPCID;
                    if (!configurationSaver.SaveUserConfiguration(UserConfig))
                    {
                        EventLogger.WriteLog("SERVICE REVERTEDS CLIENT NEW PC ID ERROR", "Error when save user configuration!");
                    }
                    else
                        EventLogger.WriteLog("SERVICE REVERTED NEW CLIENT PC ID", "");
                }

            }
            #endregion

            #region --Detect GPU Cards--
            var gpuList = DeviceManager.GetAllGPUInformation();
            string informationString = $"Detected GPUs: {gpuList.Count}";
            foreach (var gpu in gpuList)
            {
                EventLogger.WriteLog("GPU LIST", "\n" + gpu.ToString());
            }

            
            #endregion

            #region ---Start Check Timer---
            EventLogger.WriteLog("TIMER", "Starting Timer");
            if (CheckTimer != null)
            {
                CheckTimer.Stop();
                CheckTimer.Dispose();
            }
            try
            {
                CheckTimer = new Timer();
                CheckTimer.Elapsed += new ElapsedEventHandler(CheckGPUStatus);
                CheckTimer.Interval = ServiceConfig.CheckInterval * 1000;
                CheckTimer.Start();
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("TIMER ERROR", ex.ToString());
                EventLogger.WriteLog("", "Exitting....");
                return;
            }
            #endregion

            #region ---Start WCF Service---

            try
            {
                //Close Service host if it is already running (when restart Service)
                if (serviceHost != null) serviceHost.Close();
                //Get address from config file
                var address = $"http://localhost:{ServiceConfig.ServicePort}/{ServiceConfig.ServiceName}";
                EventLogger.WriteLog("WCFSERVICE", $"Start service at:{address}");
                serviceHost = new ServiceHost(typeof(MinerTracker_WCFService), new Uri(address));
                //Add endpoint to host Service host
                serviceHost.AddServiceEndpoint(typeof(IMinerTracker_WCFService), new WSHttpBinding(), "");
                //Add Metadata Exchange
                ServiceMetadataBehavior serviceBehavior = new ServiceMetadataBehavior()
                {
                    HttpGetEnabled = true
                };
                serviceHost.Description.Behaviors.Add(serviceBehavior);
                //Start Service host
                serviceHost.Open();

            }
            catch (Exception ex)
            {
                serviceHost = null;
                EventLogger.WriteLog("ERROR", ex.ToString());
            }
            #endregion

            #region --Remove log if size is big--
            var timer = new System.Timers.Timer((DateTime.Today.AddDays(1) - DateTime.Now).TotalMilliseconds);
            timer.Elapsed += new ElapsedEventHandler(OnMidnight);
            timer.Start();
            #endregion

        }

        private void OnMidnight(object sender, ElapsedEventArgs e)
        {
            try
            {
                var logFileInfo = new FileInfo(EventLogger.GetLogPath(ServiceConfig.LogPath));
                //if log file size is bigger than MAX MB
                if ((logFileInfo.Length / 8) / 1024 >  MAX_LOG_FILE_SIZE)
                {
                    File.Delete(EventLogger.GetLogPath(ServiceConfig.LogPath));
                }
                EventLogger.WriteLog("LOG RESETED","");
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("RESET LOG ERROR", ex.ToString());
            }
        }

        protected override void OnStop()
        {
            #region ---End WCF Service---
            EventLogger.WriteLog("WCFSERVICE", "Close service");
            try
            {
                serviceHost.Close();

            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("ERROR", ex.ToString());

            }
            serviceHost = null;
            #endregion
            #region --- End Check Timer ---
            EventLogger.WriteLog("TIMER", "Stopping Timer");
            CheckTimer.Stop();
            CheckTimer.Dispose();
            CheckTimer = null;
            #endregion
        }

        private void CheckGPUStatus(object callBack, ElapsedEventArgs e)
        {
            var gpuList = DeviceManager.GetAllGPUInformation();
            var computerName = Environment.MachineName;
            var currentUser = Environment.UserName;
            var macAddress = MacAddress.GetFirstMacAddress();
            var time = DateTime.Now.ToString("dd/MM/yyyy H:mm:ss");

            var PCID = UserConfig == null || UserConfig.PCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddress}" : UserConfig.PCID;
            UserComputer computer = new UserComputer(PCID ,ServiceConfig.UserID, time, gpuList);
            HttpRequest.SendPostRequest(ServiceConfig.ServerAddress, JsonConverter.ConvertToJson(computer));
        }
    
    }

}

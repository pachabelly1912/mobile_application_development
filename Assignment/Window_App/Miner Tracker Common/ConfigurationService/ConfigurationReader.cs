using Miner_Tracker_Common.LogService;
using Miner_Tracker_Common.Model.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Miner_Tracker_Common.ConfigurationService
{
    public class ConfigurationReader
    {

        private XmlDocument ServiceConfigFile;
        private XmlNode ServiceConfigNodes;
        private XmlDocument UserConfigFile;
        private XmlNode UserConfigNodes;
        private bool LoadServiceSuccess = false;
        private bool LoadUserSuccess = false;
        private const string SERVICE_CONFIG_FILE = "service.config";
        private const string USER_CONFIG_FILE = "user.config";

        public ConfigurationReader(bool isService = true, string userConfigPath = "ApplicationFolder", string userConfigFile="user.config")
        {
            try
            {
                if (isService)
                    {
                    string serviceConfigFullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, SERVICE_CONFIG_FILE);
                    //EventLogger.WriteLog("CONFIG", string.Format("Service config file is read at path: {0}", serviceConfigFullPath));
                    ServiceConfigFile = new XmlDocument();
                    ServiceConfigFile.Load(serviceConfigFullPath);
                    ServiceConfigNodes = ServiceConfigFile.SelectSingleNode("/configuration");
                    LoadServiceSuccess = true;
                }
                else
                {
                    string userConfigFolder =  (userConfigPath.Equals("ApplicationFolder"))? AppDomain.CurrentDomain.BaseDirectory : userConfigPath;
                    string userConfigFullPath = Path.Combine(userConfigFolder, userConfigFile);
                    //EventLogger.WriteLog("CONFIG", string.Format("User config file found is read at path: {0}", userConfigFullPath));
                    UserConfigFile = new XmlDocument();
                    UserConfigFile.Load(userConfigFullPath);
                    UserConfigNodes = UserConfigFile.SelectSingleNode("/configuration");
                    LoadUserSuccess = true;
                }
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("CONFIG/ERROR", ex.ToString());
            }
        }

        /// <summary>
        /// Get Service configuration from XML File
        /// </summary>
        /// <returns>
        /// ServiceConfig if successed
        /// Null if failed
        /// </returns>
        public ServiceConfiguration GetServiceConfig()
        {
            if (LoadServiceSuccess)
            {
                EventLogger.WriteLog("CONFIG", "Reading service configuration file");
                var serviceConfig = new ServiceConfiguration();
                foreach (XmlNode configNode in ServiceConfigNodes.ChildNodes)
                {
                    EventLogger.WriteLog("CONFIG", string.Format("Found {0} configuration of service: {1}", configNode.Name, configNode.ChildNodes[0].Value.Trim()));

                    switch (configNode.Name.Trim())
                    {
                        case "serverAddress":
                            serviceConfig.ServerAddress = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "serverUpdateIDAddress":
                            serviceConfig.ServerUpdateIDAddress = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "serviceName":
                            serviceConfig.ServiceName = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "servicePort":
                            serviceConfig.ServicePort = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "logPath":
                            serviceConfig.LogPath = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "checkInterval":
                            serviceConfig.CheckInterval = int.Parse(configNode.ChildNodes[0].Value.Trim());
                            break;
                        case "userPCID":
                            serviceConfig.UserPCID = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userConfigPath":
                            serviceConfig.UserConfigPath = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userConfigFileName":
                            serviceConfig.UserConfigFileName = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userID":
                            serviceConfig.UserID = int.Parse(configNode.ChildNodes[0].Value.Trim());
                            break;
                        case "userLogPath":
                            serviceConfig.UserLogPath = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userCheckInterval":
                            serviceConfig.UserCheckInterval = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userOpenOnStartup":
                            serviceConfig.UserOpenOnStartup = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userMinimizedWhenClose":
                            serviceConfig.UserMinimizedWhenClose = configNode.ChildNodes[0].Value.Trim();
                            break;
                        default:
                            EventLogger.WriteLog("ERROR", string.Format("Unknown service attribute \"{0}\" in config file", configNode.Name));
                            break;
                    }
                }
                EventLogger.WriteLog("CONFIG", "Finished reading");
                return serviceConfig;
            }
            else return null;
            
        }

        public UserConfiguration GetUserConfig()
        {
            if (LoadUserSuccess)
            {
                var userConfig = new UserConfiguration();
                foreach (XmlNode configNode in UserConfigNodes.ChildNodes)
                {
                    //EventLogger.WriteLog("CONFIG", string.Format("Found {0} configuration of user: {1}", configNode.Name, configNode.ChildNodes[0].Value.Trim()));
                    switch (configNode.Name.Trim())
                    {
                        case "userPCID":
                            userConfig.PCID = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userID":
                            userConfig.ID = int.Parse(configNode.ChildNodes[0].Value.Trim());
                            break;
                        case "userLogPath":
                            userConfig.LogPath = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userCheckInterval":
                            userConfig.CheckInterval = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userOpenOnStartup":
                            userConfig.OpenOnStartup = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userMinimizedWhenClose":
                            userConfig.MinimizedWhenClose = configNode.ChildNodes[0].Value.Trim();
                            break;
                        case "userPreviousPCID":
                            userConfig.PreviousPCID = configNode.ChildNodes[0].Value.Trim();
                            break;
                        default:
                            EventLogger.WriteLog("ERROR", string.Format("Unknown service attribute \"{0}\" in config file", configNode.ChildNodes[0].Value.Trim()));
                            break;
                    }
                }
                return userConfig;
            }
            else return null;
        }
    }
}

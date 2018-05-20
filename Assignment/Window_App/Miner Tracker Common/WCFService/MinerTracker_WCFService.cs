using Miner_Tracker_Common.ConfigurationService;
using Miner_Tracker_Common.CryptoService;
using Miner_Tracker_Common.ManagementService;
using Miner_Tracker_Common.LogService;
using Miner_Tracker_Common.Model.Configuration;
using Miner_Tracker_Common.Model.Monitoring;
using System;
using System.Collections.Generic;
using System.IO;

namespace Miner_Tracker_Common.WCFService
{
    public class MinerTracker_WCFService : IMinerTracker_WCFService
    {
        #region ----Credetial----
        private bool CheckCredential(string encryptedId)
        {
            string Id = CryptTool.Decrypt(encryptedId);
            if (Id.Contains("Client") && Id.Contains("Miner Tracker"))
                return true;
            else
                return false;
        }

        public ServiceConfiguration GetServiceConfig(string clientId)
        {
            if (CheckCredential(clientId))
            {
                ConfigurationReader serviceConfigurationReader = new ConfigurationReader();
                return serviceConfigurationReader.GetServiceConfig();
            }
            return null;
        }
        #endregion

        #region ----Test-----
        public int TestService(int value)
        {
            return value;
        }
        #endregion

        public bool EnableOnStartUp(string clientId, string name, string executePath)
        {
            if (CheckCredential(clientId)) return RegistryManager.AddRegistry("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", name, executePath);
            return false;
        }

        public bool DisableOnStartUp(string clientId, string name)
        {
            if (CheckCredential(clientId))
            {
                try
                {
                    Microsoft.Win32.RegistryKey key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);
                    key.DeleteValue(name, true);
                    return true;
                }
                catch (Exception ex)
                {
                    EventLogger.WriteLog("REMOVE REGISTRY ERROR", ex.ToString());
                }
            }
            return false;
        }

        public List<UserGPU> GetUserGPUInformation(string clientId)
        {
            if (CheckCredential(clientId))
            {
                return DeviceManager.GetAllGPUInformation();
            }
            return null;
        }

        public bool CheckCloudConnection(string clientId)
        {
            if (CheckCredential(clientId))
            {
                
            }
            return false;
        }

        public bool SaveUserConfiguration(string clientId, UserConfiguration userConfiguration)
        {
             /* 
             <userID>1</userID>
             <userLogPath>C:\Logs</userLogPath>
             <userCheckInterval>5</userCheckInterval>
             <userOpenOnStartUp>1</userOpenOnStartUp>
             */
            if (CheckCredential(clientId))
            {
                var confReader = new ConfigurationReader();
                var serverConfig = confReader.GetServiceConfig();
                var confSaver = new ConfigurationSaver(serverConfig.UserLogPath);
                if (!confSaver.AddAttribute("userID", userConfiguration.ID.ToString())
                    || !confSaver.AddAttribute("userLogPath", userConfiguration.LogPath)
                    || !confSaver.AddAttribute("userCheckInterval", userConfiguration.CheckInterval)
                    || !confSaver.AddAttribute("userOpenOnStartup", userConfiguration.OpenOnStartup))
                {
                    return false;
                }
                else
                {
                    string userConfigFolder = (serverConfig.UserConfigPath.Equals("ApplicationFolder")) ? AppDomain.CurrentDomain.BaseDirectory : serverConfig.UserConfigPath;
                    string userConfigFullPath = Path.Combine(userConfigFolder, serverConfig.UserConfigFileName);
                    return confSaver.SaveXML(userConfigFullPath);
                }
            }
            return false;
        }
    }
}

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
    public class ConfigurationSaver
    {
        private XmlDocument XMLDocument;
        private XmlNode XMLConfigurationNode;
        private string LoggerPath;

        public ConfigurationSaver(string loggerPath = @"C:\Logs")
        {
            LoggerPath = loggerPath;
            try
            {
                XMLDocument = new XmlDocument();
                var docNode = XMLDocument.CreateXmlDeclaration("1.0", "UTF-8", null);
                XMLDocument.AppendChild(docNode);
                XMLConfigurationNode = XMLDocument.CreateElement("configuration");
                XMLDocument.AppendChild(XMLConfigurationNode);

            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("XML INIT ERROR", ex.ToString(), LoggerPath);
            }
        }

        public bool AddAttribute(string attribute, string value)
        {
            try
            {
                var attributeNode = XMLDocument.CreateElement(attribute);
                attributeNode.InnerText = value;
                XMLConfigurationNode.AppendChild(attributeNode);
                return true;
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("XML ADD ERROR", ex.ToString(), LoggerPath);
                return false;
            }
        }

        public bool SaveXML(string path)
        {
            try
            {
                XMLDocument.Save(path);
                return true;
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("XML SAVE ERROR", ex.ToString(), LoggerPath);
                return false;
            }
        }

        public bool SaveUserConfiguration(UserConfiguration userConfiguration)
        {
            /* 
            <userID>1</userID>
            <userLogPath>C:\Logs</userLogPath>
            <userCheckInterval>5</userCheckInterval>
            <userOpenOnStartUp>1</userOpenOnStartUp>
            */
            var confReader = new ConfigurationReader();
            var serverConfig = confReader.GetServiceConfig();
            var confSaver = new ConfigurationSaver(serverConfig.UserLogPath);
            if (!confSaver.AddAttribute("userID", userConfiguration.ID.ToString())
                || !confSaver.AddAttribute("userPCID", userConfiguration.PCID)
                || !confSaver.AddAttribute("userPreviousPCID", userConfiguration.PreviousPCID)
                || !confSaver.AddAttribute("userLogPath", userConfiguration.LogPath)
                || !confSaver.AddAttribute("userCheckInterval", userConfiguration.CheckInterval)
                || !confSaver.AddAttribute("userOpenOnStartup", userConfiguration.OpenOnStartup)
                || !confSaver.AddAttribute("userMinimizedWhenClose", userConfiguration.MinimizedWhenClose))
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

        public bool SaveServiceConfiguration(ServiceConfiguration serviceConfiguration)
        {
            /* 
              <serviceName>minertracker</serviceName>
              <servicePort>9988</servicePort>
              <serverAddress>http://minertracker.com/api/fields</serverAddress>
              <logPath>C:\Logs</logPath>
              <checkInterval>60</checkInterval>
              <userPCID>default</userPCID>
              <userConfigPath>ApplicationFolder</userConfigPath>
              <userConfigFileName>user.config</userConfigFileName>
              <userID>1</userID>
              <userLogPath>C:\Logs</userLogPath>
              <userCheckInterval>5</userCheckInterval>
              <userOpenOnStartup>1</userOpenOnStartup>
              <userMinimizedWhenClose>1</userMinimizedWhenClose>
            */
            var confSaver = new ConfigurationSaver();
            if (
                   !confSaver.AddAttribute("serviceName", serviceConfiguration.ServiceName)
                || !confSaver.AddAttribute("servicePort", serviceConfiguration.ServicePort)
                || !confSaver.AddAttribute("serverAddress", serviceConfiguration.ServerAddress)
                || !confSaver.AddAttribute("serverUpdateIDAddress", serviceConfiguration.ServerUpdateIDAddress)
                || !confSaver.AddAttribute("logPath", serviceConfiguration.LogPath)
                || !confSaver.AddAttribute("checkInterval", serviceConfiguration.CheckInterval.ToString())
                || !confSaver.AddAttribute("userPCID", serviceConfiguration.UserPCID)
                || !confSaver.AddAttribute("userConfigPath", serviceConfiguration.UserConfigPath)
                || !confSaver.AddAttribute("userConfigFileName", serviceConfiguration.UserConfigFileName)
                || !confSaver.AddAttribute("userID", serviceConfiguration.UserID.ToString())
                || !confSaver.AddAttribute("userLogPath", serviceConfiguration.UserLogPath)
                || !confSaver.AddAttribute("userCheckInterval", serviceConfiguration.UserCheckInterval)
                || !confSaver.AddAttribute("userOpenOnStartup", serviceConfiguration.UserOpenOnStartup)
                || !confSaver.AddAttribute("userMinimizedWhenClose", serviceConfiguration.UserMinimizedWhenClose))
            {
                return false;
            }
            else
            {
                string configFullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "service.config");
                return confSaver.SaveXML(configFullPath);
            }
        }
    }
}

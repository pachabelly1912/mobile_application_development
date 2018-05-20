using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.ManagementService
{
    public static class RegistryManager
    {
        public static bool AddRegistry(string path, string key, string value)
        {
            try
            {
                Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(path, true);
                regKey.SetValue(key, value);
                return true;
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("ADD REGISTRY ERROR", ex.ToString());
            }

            return false;
        }

        public static bool RemoveRegistry(string path, string key)
        {
            try
            {
                Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(path, true);
                regKey.DeleteValue(key, true);
                return true;
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("REMOVE REGISTRY ERROR", ex.ToString());
                return false;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Management;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.ManagementService
{
    public static class ComputerManager
    {
        public static string GetOSName()
        {
            var name = (from x in new ManagementObjectSearcher("SELECT Caption FROM Win32_OperatingSystem").Get().Cast<ManagementObject>()
                       select x.GetPropertyValue("Caption")).FirstOrDefault();
            return name != null ? name.ToString() : "Unknown" ;
        }


        public static string GetOSVersion()
        {
            var name = (from x in new ManagementObjectSearcher("SELECT Version FROM Win32_OperatingSystem").Get().Cast<ManagementObject>()
                        select x.GetPropertyValue("Version")).FirstOrDefault();
            return name != null ? name.ToString() : "Unknown";
        }
    }
}

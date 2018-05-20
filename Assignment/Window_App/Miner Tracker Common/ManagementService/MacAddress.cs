using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.ManagementService
{
    public static class MacAddress
    {
        public static string GetFirstMacAddress()
        {
            return GetAllMacAddresses().FirstOrDefault();
        }

        public static IEnumerable<string> GetAllMacAddresses()
        {
            return
           (
               from nic in NetworkInterface.GetAllNetworkInterfaces()
               where nic.OperationalStatus == OperationalStatus.Up
               select nic.GetPhysicalAddress().ToString()
           );

        }
    }
}

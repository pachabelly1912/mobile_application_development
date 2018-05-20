using Miner_Tracker_Common.ConfigurationService;
using Miner_Tracker_Common.CryptoService;
using Miner_Tracker_Common.ManagementService;
using System;
using System.Management;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using Miner_Tracker_Common.ProcessService;
using System.Threading;
using System.Text.RegularExpressions;
using OpenHardwareMonitor.Hardware;
using Miner_Tracker_Common.Model.Monitoring;
using Miner_Tracker_Common.Utils;
using Miner_Tracker_Common.NetworkService;
using Microsoft.Win32.TaskScheduler;
using Miner_Tracker_Common.TaskSchedulerService;
using System.IO;
using System.Net;
using Miner_Tracker_Common.LogService;

namespace ConsoleTest
{
    class Program
    {
        static void Main(string[] args)
        {
            var version = AssemblyInformationManager.GetAssemblyVersion(@"C:\Program Files\Miner Tracker\Miner Tracker Desktop.exe");
            Console.WriteLine($"Version: {version}");
            Console.WriteLine("--------End------------");
            //Console.WriteLine(res[0].ToString());
            Console.ReadKey();

        }
    }
}

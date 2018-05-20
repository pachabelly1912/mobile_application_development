using System;
using System.Configuration.Install;
using System.Linq;
using System.ServiceProcess;
using System.Reflection;
using System.Threading.Tasks;
using Miner_Tracker_Common.LogService;
using System.IO;
using Miner_Tracker_Common.TaskSchedulerService;

namespace Miner_Tracker_Service
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            string serviceName = "MinerTrackerService";

            if (Environment.UserInteractive)
            {
                if (args.Length > 0)
                {
                    switch (args[0])
                    {
                        case "--install":
                            {
                                //Install
                                ManagedInstallerClass.InstallHelper(new string[] { Assembly.GetExecutingAssembly().Location });
                                //string currentFolder = AppDomain.CurrentDomain.BaseDirectory;
                                //string desktopApplicationPath = Path.Combine(currentFolder, "Miner Tracker Desktop.exe");
                                //TaskManagement.AddTask(desktopApplicationPath, currentFolder, "", taskName, "Start Miner Tracker Desktop");
                                EventLogger.WriteLog("SERVICE", "Service has been installed successfully");
                                break;
                            }
                        case "--uninstall":
                            {
                                ServiceController controller = new ServiceController(serviceName);
                                if (controller.Status == ServiceControllerStatus.Running)
                                    controller.Stop();
                                ManagedInstallerClass.InstallHelper(new string[] { "/u", Assembly.GetExecutingAssembly().Location });
                                //TaskManagement.RemoveTask(taskName);
                                EventLogger.WriteLog("SERVICE", "Service has been uninstalled successfully");
                                break;
                            }
                        case "--start":
                            {
                                ServiceController controller = new ServiceController(serviceName);
                                if (controller.Status == ServiceControllerStatus.Stopped)
                                    controller.Start();
                                EventLogger.WriteLog("SERVICE", "Service has been started successfully");
                                break;
                            }
                        default:
                            EventLogger.WriteLog("SERVICE", "Unknown argument when installing service!");
                            break;
                    }
                }
            }
            else
            {
                ServiceBase[] ServicesToRun;
                ServicesToRun = new ServiceBase[] { new MinerTrackerService() };
                ServiceBase.Run(ServicesToRun);
            }
        }
    }
}

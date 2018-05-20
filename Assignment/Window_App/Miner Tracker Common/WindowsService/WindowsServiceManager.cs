using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.Configuration.Install;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.WindowsService
{
    public static class WindowsServiceManager
    {
        public static bool RestartService(string serviceName)
        {
            var stop = StopService(serviceName);
            Thread.Sleep(100);
            var restart = StartService(serviceName);
            return stop && restart;
        }

        public static bool StopService(string serviceName)
        {
            ServiceController controller = new ServiceController(serviceName);
            if (controller.Status == ServiceControllerStatus.Running)
                try
                {
                    controller.Stop();
                    EventLogger.WriteLog("SERVICE", $"Service {serviceName} has been stopped successfully");
                    return true;
                }
                catch (Exception ex)
                {
                    EventLogger.WriteLog("SERVICE STOP ERROR", ex.ToString());
                }
            else EventLogger.WriteLog("SERVICE STOP ERROR", "Service not running");
            return false;
        }

        public static bool StartService(string serviceName)
        {
            ServiceController controller = new ServiceController(serviceName);
            if (controller.Status == ServiceControllerStatus.Stopped)
                try
                {
                    controller.Start();
                    EventLogger.WriteLog("SERVICE", $"Service {serviceName} has been started successfully");
                    return true;
                }
                catch (Exception ex)
                {
                    EventLogger.WriteLog("SERVICE START ERROR", ex.ToString());
                }
            else EventLogger.WriteLog("SERVICE STOP ERROR", "Can not start service");
            return true;
        }
    }
}

using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.ManagementService
{
    public static class ServiceManager
    {
        public static bool CheckIfServiceRunning(string serviceName)
        {
            try
            {
                using (ServiceController sc = new ServiceController(serviceName))
                {
                    return sc.Status == ServiceControllerStatus.Running;
                }
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("PROCESS CHECK ERROR", ex.ToString());
                return false;
            }
        }
    }
}

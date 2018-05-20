using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.LogService
{
    static class WindowsEventLogger
    {
        static string logSource = "Miner Tracker Service";
        static string logType = "Application";

        public static void WriteLog(string message)
        {
            if (!EventLog.SourceExists(logSource))
                EventLog.CreateEventSource(logSource, logType);

            EventLog.WriteEntry(logSource, message);
        }
    }
}

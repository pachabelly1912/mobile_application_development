using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.LogService
{
    public class EventLogger
    {
        private const string LOG_FILE_NAME = "MinerTrackerLog.txt";

        public static void WriteLog(string type, string message, string logPath = @"C:\Logs")
        {
            try
            {
                Directory.CreateDirectory(logPath);
                FileStream objFilestream = new FileStream(Path.Combine(logPath, LOG_FILE_NAME), FileMode.Append, FileAccess.Write);
                StreamWriter objStreamWriter = new StreamWriter(objFilestream);
                objStreamWriter.WriteLine(DateTime.Now);
                objStreamWriter.WriteLine(string.Format("{0}: {1}\n", type, message));
                objStreamWriter.Close();
                objFilestream.Close();
            }
            catch (Exception ex)
            {
                WindowsEventLogger.WriteLog(ex.ToString());
            }
        }
        public static string GetLogFileName() => LOG_FILE_NAME;

        public static string GetLogPath(string folder) => Path.Combine(folder, LOG_FILE_NAME);
    }
}

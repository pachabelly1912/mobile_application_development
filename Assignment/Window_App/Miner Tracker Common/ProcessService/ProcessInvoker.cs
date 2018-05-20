using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.ProcessService
{
    public class ProcessInvoker
    { 
        private Process Proc;

        public ProcessInvoker(string processName, string args = "")
        {
            try
            {
                Proc = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = processName,
                        Arguments = args,
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        CreateNoWindow = true
                    }
                };
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("PROCESS ERROR", ex.ToString());
            }
        }

        public List<string> GetProcessOutput()
        {
            var result = new List<string>();
            try
            {
                Proc.Start();
                while (!Proc.StandardOutput.EndOfStream)
                {
                    string line = Proc.StandardOutput.ReadLine();
                    result.Add(line);
                }
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("ERROR", ex.ToString());
            }
            return result;
        }

    }
}

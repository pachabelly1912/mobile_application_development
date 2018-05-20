using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.ManagementService
{
    public static class AssemblyInformationManager
    {
        public static String GetAssemblyVersion(string fileName)
        {
            try
            {
                return AssemblyName.GetAssemblyName(fileName).Version.ToString();
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("GET ASSEMBLY ERROR", ex.ToString());
                return "Error";
            }
        }

        public static DateTime GetCreatedTime(string fileName)
        {
            try
            {
                return File.GetCreationTime(fileName);
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("GET CREATED TIME ERROR", ex.ToString());
                return new DateTime(2018,3,14);
            }
        }
    }
}

using Miner_Tracker_Common.LogService;
using Miner_Tracker_Common.Model.Monitoring;
using Miner_Tracker_Common.ProcessService;
using OpenHardwareMonitor.Hardware;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.ManagementService
{
    public static class DeviceManager
    {
        private static bool IS_ID_SIMPLIED = true;
        public static List<string> GetAllNvidiaGPUName()
        {
            try
            {
                if (File.Exists(@"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe"))
                {
                    var proc = new ProcessInvoker(@"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe", "-L");
                    var result = proc.GetProcessOutput();
                    var error = result.FirstOrDefault(item => item.Contains("has failed") || item.Contains("Not Found") || item.Contains("NVIDIA-SMI couldn't find nvml.dll"));
                    if (error != null) return null;
                    else return result;
                }
                else
                {
                    /*
                    var proc = new ProcessInvoker("nvidia-smi.exe", "-L");
                    var result = proc.GetProcessOutput();
                    var error = result.FirstOrDefault(item => item.Contains("has failed") || item.Contains("Not Found") || item.Contains("NVIDIA-SMI couldn't find nvml.dll"));
                    if (error != null) return null;
                    else return result;
                    */
                    return null;
                }
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("FIND NVIDIA GPU ERROR", ex.ToString());
                return null;
            }
        }

        public static List<string> GetAllAtiGPUName()
        {
            try
            {
                Computer thisComputer = new Computer();
                thisComputer.GPUEnabled = true;
                thisComputer.Open();
                var result = new List<string>();

                foreach (var hardwareItem in thisComputer.Hardware)
                {
                    if (hardwareItem.HardwareType == HardwareType.GpuAti)
                    {
                        result.Add(hardwareItem.Name + " ID:" + hardwareItem.Identifier);
                    }
                }
                thisComputer.Close();
                if (result.Count == 0) return null;
                else return result;
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("FIND ATI GPU ERROR", ex.ToString());
                return null;
            }
        }

        public static List<UserGPU> GetAtiGPUInformation()
        { 
            var resultList = new List<UserGPU>();

            try
            {
                Computer thisComputer = new Computer();
                thisComputer.GPUEnabled = true;
                thisComputer.Open();
                foreach (var hardwareItem in thisComputer.Hardware)
                {
                    if (hardwareItem.HardwareType == HardwareType.GpuAti)
                    {
                        var gpu = new UserGPU();
                        gpu.ID = "-1";
                        gpu.Name = hardwareItem.Name;

                        var sensorList = hardwareItem.Sensors;

                        foreach (var sensor in sensorList)
                        {
                            switch (sensor.SensorType)
                            {
                                case SensorType.Control:
                                    if (sensor.Name.Equals("GPU Fan"))
                                        gpu.FanSpeed = (int)sensor.Value;
                                    break;
                                case SensorType.Temperature:
                                    if (sensor.Name.Equals("GPU Core"))
                                        gpu.Temperature = (int)sensor.Value;
                                    break;
                                case SensorType.Load:
                                    if (sensor.Name.Equals("GPU Core"))
                                        gpu.MemoryUsage = (float)sensor.Value;
                                    break;
                            }
                        }
                        resultList.Add(gpu);
                    }
                }
                thisComputer.Close();
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("READ ATI GPU ERROR", ex.ToString());
            }
            return resultList;
        }



        public static List<UserGPU> GetNvidiaGPUInformation()
        {
            var gpuList = GetAllNvidiaGPUName();
            var resultList = new List<UserGPU>();

            if (gpuList != null)
            {
                var infoProc = new ProcessInvoker(@"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe");
                var infoResult = infoProc.GetProcessOutput();
                //The start of GPU information row in the table
                int currentRow = 8;
                try
                {

                    foreach (var gpu in gpuList)
                    {
                        //GPU 0: GeForce GTX 750 Ti(UUID: GPU - 73c10860 - 789a - f96f - 6a61 - 023499306183)
                        var gpuIdList = gpu.Replace(")", " ").Replace("(", " ").Replace("UUID", "").Split(':');
                        var gpuName = gpuIdList[1].Trim();
                        var gpuID = gpuIdList[2].Trim();
                        //Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
                        //29%   40C    P8     1W /  38W |    298MiB /  2048MiB |      0%      Default
                        // 0    1       2      3     4          5       6               7       8
                        var gpuInfoList = infoResult[currentRow].Replace("|", " ").Replace("/", " ").Split(' ').Where(item => !item.Equals("")).ToList();
                        UserGPU thisGPU = new UserGPU
                        {
                            ID = "-1",
                            Name = "NVIDIA " + gpuName,
                            FanSpeed = Regex.Match(gpuInfoList[0], @"\d+").Value.Length <= 0 ? -1 : int.Parse(Regex.Match(gpuInfoList[0], @"\d+").Value),
                            Temperature = Regex.Match(gpuInfoList[1], @"\d+").Value.Length <= 0 ? -1 : int.Parse(Regex.Match(gpuInfoList[1], @"\d+").Value),
                            PowerUsage = Regex.Match(gpuInfoList[3], @"\d+").Value.Length <= 0 ? -1 : int.Parse(Regex.Match(gpuInfoList[3], @"\d+").Value),
                            PowerLimit = Regex.Match(gpuInfoList[4], @"\d+").Value.Length <= 0 ? -1 : int.Parse(Regex.Match(gpuInfoList[4], @"\d+").Value),
                            MemoryUsage = Regex.Match(gpuInfoList[5], @"\d+").Value.Length <= 0 || Regex.Match(gpuInfoList[6], @"\d+").Value.Length <= 0 ? -1 : 100 * float.Parse(Regex.Match(gpuInfoList[5], @"\d+").Value) / float.Parse(Regex.Match(gpuInfoList[6], @"\d+").Value),
                            MemoryTotal = Regex.Match(gpuInfoList[6], @"\d+").Value.Length <= 0 ? -1 : int.Parse(Regex.Match(gpuInfoList[6], @"\d+").Value),
                            MemoryUtilization = Regex.Match(gpuInfoList[7], @"\d+").Value.Length <= 0 ? -1 : int.Parse(Regex.Match(gpuInfoList[7], @"\d+").Value)
                        };

                        resultList.Add(thisGPU);
                        //Next row
                        currentRow += 3;
                    }
                }

                catch (Exception ex)
                {
                    EventLogger.WriteLog("READ NVIDIA GPU ERROR", ex.ToString());
                    return resultList;
                }
            }
            return resultList;
        }

        public static List<UserGPU> GetAllGPUInformation()
        {
            if (IS_ID_SIMPLIED)
            {
                var gpuList = GetNvidiaGPUInformation().Concat(GetAtiGPUInformation()).ToList();
                foreach (var gpu in gpuList)
                {
                    gpu.ID = (gpuList.IndexOf(gpu) + 1).ToString();
                }
                return gpuList;
            }
            else return GetNvidiaGPUInformation().Concat(GetAtiGPUInformation()).ToList();
        }
    }
}

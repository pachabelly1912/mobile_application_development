using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.Model.Monitoring
{
    [DataContract]
    public class UserGPU : Hardware
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public int FanSpeed { get; set; }
        [DataMember]
        public int Temperature { get; set; }
        [DataMember]
        public int PowerUsage { get; set; }
        [DataMember]
        public int PowerLimit { get; set; }
        [DataMember]
        public float MemoryUsage { get; set; }
        [DataMember]
        public int MemoryTotal { get; set; }
        [DataMember]
        public int MemoryUtilization { get; set; }

        [OperationContract]
        public override string ToString()
        {
            return $"Device ID: {ID}\nGPU Name: {Name}\nFanSpeed: {FanSpeed}%\nTemp: {Temperature}°C\nPower(NVIDIA Only): {PowerUsage}W/{PowerLimit}W\nMemory Usage: {MemoryUsage*100}%\nUltilization(NVIDIA Only): {MemoryUtilization}%";
        }
    }
}

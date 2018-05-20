using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;

namespace Miner_Tracker_Common.Model.Monitoring
{
    [DataContract]
    public class UserComputer: Hardware
    {   
        [DataMember]
        public int User { get; set; }
        [DataMember]
        public string Time { get; set; }
        [DataMember]
        public List<UserGPU> GPUs { get; set; }

        public UserComputer(string id, int user, string time, List<UserGPU> gpus)
        {
            User = user;
            ID = id;
            Time = time;
            GPUs = gpus;
        }

        [OperationContract]
        public override string ToString()
        {
            var cpuList = "";
            foreach (UserGPU gpu in GPUs)
            {
                cpuList += "\n" + gpu.ToString();
            }
            return $"ID: {ID}\nUser: {User}\nTime: {Time}" + cpuList;
        }
    }
}

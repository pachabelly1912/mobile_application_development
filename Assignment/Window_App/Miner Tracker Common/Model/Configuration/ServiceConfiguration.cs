using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.Model.Configuration
{
    [DataContract]
    public class ServiceConfiguration
    {
        [DataMember]
        public string ServiceName { get; set; }
        [DataMember]
        public string ServicePort { get; set; }
        [DataMember]
        public string ServerAddress { get; set; }
        [DataMember]
        public string ServerUpdateIDAddress { get; set; }
        [DataMember]
        public string LogPath { get; set; }
        [DataMember]
        public int CheckInterval { get; set; }
        [DataMember]
        public string UserPCID { get; set; }
        [DataMember]
        public string UserConfigPath { get; set; }
        [DataMember]
        public string UserConfigFileName { get; set; }
        [DataMember]
        public int UserID { get; set;}
        [DataMember]
        public string UserLogPath { get;set; }
        [DataMember]
        public string UserCheckInterval { get; set;}
        [DataMember]
        public string UserOpenOnStartup { get; set; }
        [DataMember]
        public string UserMinimizedWhenClose { get; set; }


    }
}

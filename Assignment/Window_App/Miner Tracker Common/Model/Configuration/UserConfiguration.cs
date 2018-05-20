using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.Model.Configuration
{
    public class UserConfiguration
    {
        public string PCID { get; set; }
        public string PreviousPCID { get; set; }
        public int ID { get; set; }
        public string LogPath { get; set; }
        public string CheckInterval { get; set; }
        public string OpenOnStartup { get; set; }
        public string MinimizedWhenClose { get; set; } 
    }
}

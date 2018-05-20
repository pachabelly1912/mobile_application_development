using Miner_Tracker_Common.Model.Configuration;
using Miner_Tracker_Common.Model.Monitoring;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.WCFService
{
    [ServiceContract]
    public interface IMinerTracker_WCFService
    {
        #region --Test---
        [OperationContract]
        int TestService(int value);
        #endregion

        #region --Get config--
        [OperationContract]
        Model.Configuration.ServiceConfiguration GetServiceConfig(string clientId);
        #endregion

        #region --Autostart option for WPG--
        [OperationContract]
        bool EnableOnStartUp(string clientId, string name, string executePath);
        [OperationContract]
        bool DisableOnStartUp(string clientId, string name);
        #endregion

        [OperationContract]
        List<UserGPU> GetUserGPUInformation(string clientId);

        [OperationContract]
        bool CheckCloudConnection(string clientId);

        [OperationContract]
        bool SaveUserConfiguration(string clientId, UserConfiguration userConfiguration);
    }
}

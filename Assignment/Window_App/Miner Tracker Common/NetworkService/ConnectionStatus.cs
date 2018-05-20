using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.NetworkService
{
    public static class ConnectionStatus
    {
        public static bool IsConnected()
        {
            System.Uri Url = new System.Uri("http://www.microsoft.com");

            System.Net.WebRequest WebReq;
            System.Net.WebResponse Resp;
            WebReq = System.Net.WebRequest.Create(Url);

            try
            {
                Resp = WebReq.GetResponse();
                Resp.Close();
                WebReq = null;
                return true;
            }

            catch
            {
                WebReq = null;
                return false;
            }
        }
    }
}

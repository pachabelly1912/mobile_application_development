using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.NetworkService
{
    public static class HttpRequest
    {
        public static string SendPostRequest(string address, string data, string dataType = "json")
        {
            try
            {
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(address);
                httpWebRequest.ContentType = $"application/{dataType}";
                httpWebRequest.Method = "POST";
                httpWebRequest.KeepAlive = false;
                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(data);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    return streamReader.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("NETWORK ERROR", ex.ToString());
                return ex.ToString();
            }
        }

        public static string SendPutRequest(string address, string data, string userID, string dataType = "json")
        {
            try
            {
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(address);
                httpWebRequest.ContentType = $"application/{dataType}";
                httpWebRequest.Method = "PUT";
                httpWebRequest.KeepAlive = false;
                httpWebRequest.Headers["user"] = userID;
                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(data);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    return streamReader.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("NETWORK ERROR", ex.ToString());
                return ex.ToString();
            }
        }
    }
}

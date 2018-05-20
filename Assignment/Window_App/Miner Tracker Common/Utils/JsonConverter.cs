using Newtonsoft.Json;

namespace Miner_Tracker_Common.Utils
{
    public static class JsonConverter
    {
        public static string ConvertToJson(object data) => JsonConvert.SerializeObject(data);
        public static object ConvertToObject(string json) => JsonConvert.DeserializeObject(json);
    }
}

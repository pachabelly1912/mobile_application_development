using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.IO;
using Miner_Tracker_Common.LogService;

namespace Miner_Tracker_Common.CryptoService
{
    public static class CryptTool
    {
        private const string AES_KEY = "zXb@194&43";

        public static string Encrypt(string text, string EncryptType="AES")
        {
            string result = "";
            byte[] bytesToBeEncrypted = Encoding.Unicode.GetBytes(text);

            switch (EncryptType){

                case "AES":
                    try
                    {
                        using (Aes encryptor = Aes.Create())
                        {
                            Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(AES_KEY, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                            encryptor.Key = pdb.GetBytes(32);
                            encryptor.IV = pdb.GetBytes(16);
                            using (MemoryStream ms = new MemoryStream())
                            {
                                using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                                {
                                    cs.Write(bytesToBeEncrypted, 0, bytesToBeEncrypted.Length);
                                    cs.Close();
                                }
                                result = Convert.ToBase64String(ms.ToArray());
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        EventLogger.WriteLog("ENCRYPT", ex.ToString());
                    }
                    break;
            }
            return result;
        }

        public static string Decrypt(string cipherText, string DecryptType="AES")
        {
            string result = "";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            switch(DecryptType)
            {
                case "AES":
                    try
                    {
                        using (Aes encryptor = Aes.Create())
                        {
                            Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(AES_KEY, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                            encryptor.Key = pdb.GetBytes(32);
                            encryptor.IV = pdb.GetBytes(16);
                            using (MemoryStream ms = new MemoryStream())
                            {
                                using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                                {
                                    cs.Write(cipherBytes, 0, cipherBytes.Length);
                                    cs.Close();
                                }
                                result = Encoding.Unicode.GetString(ms.ToArray());
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        EventLogger.WriteLog("DECRYPT", ex.ToString());
                    }
                    break;
            }

            return result;
        }
    }
}

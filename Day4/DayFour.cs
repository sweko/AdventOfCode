using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day4
{
    class DayFour
    {
        public static string Input = "bgvyzdsv";
        //public static string Input = "abcdef";

        public static string CalculateMD5Hash(string input)
        {
            // step 1, calculate MD5 hash from input
            MD5 md5 = MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }

        public static int GetNumber5()
        {
            return GetNumber("00000");
        }

        public static int GetNumber(string start)
        {
            var index = 1;
            while (true)
            {
                var entry = Input + index.ToString();
                var md5 = CalculateMD5Hash(entry);
                if (md5.StartsWith(start))
                    return index;
                if (index % 100000 == 0)
                    Console.WriteLine(index);
                index++;
            };
        }

        public static int GetNumber6()
        {
            return GetNumber("000000");
        }

    }
}

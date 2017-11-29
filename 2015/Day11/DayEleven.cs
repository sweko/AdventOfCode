using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day11
{
    public class DayEleven
    {
        public static string Process()
        {
            var oldPassword = "hepxcrrq";
            oldPassword= GetNextPassword(oldPassword);
            return GetNextPassword(oldPassword);
        }

        public static string GetNextPassword(string value)
        {
            var newPassword = value;
            while (true)
            {
                newPassword = GetNextValue(newPassword);
                if (!CheckAscending(newPassword))
                    continue;
                if (CheckPairs(newPassword) < 2)
                    continue;
                return newPassword;
            }
        }

        private static int CheckPairs(string value)
        {
            for (int i = 0; i < value.Length - 1; i++)
            {
                if (value[i + 1] != value[i])
                    continue;
                var newValue = value.Substring(0, i) + "il" + value.Substring(i + 2);
                return 1 + CheckPairs(newValue);
            }
            return 0;
        }

        private static bool CheckAscending(string value)
        {
            for (int i = 0; i < value.Length - 2; i++)
            {
                if (value[i + 1] - value[i] != 1)
                    continue;
                if (value[i + 2] - value[i + 1] != 1)
                    continue;
                return true;
            }
            return false;
        }

        public static string GetNextValue(string value)
        {
            var alphabet = "abcdefghjkmnpqrstuvwxyz";
            var last = value[value.Length - 1];
            if (last != 'z')
            {
                var index = alphabet.IndexOf(last);
                return value.Substring(0, value.Length - 1) + alphabet[index + 1];
            }
            else
            {
                return GetNextValue(value.Substring(0, value.Length - 1)) + alphabet[0];
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day8
{
    public class DayEight
    {
        private static IEnumerable<string> Load()
        {
            var lines = File.ReadAllLines(@"Day8\input.txt");
            //string[] lines =
            //{
            //    "\"\"",
            //    "\"abc\"",
            //    "\"aaa\\\"aaa\"",
            //    "\"\\x27\""
            //};
            return lines;
        }

        public static int ProcessDecode()
        {
            var strings = Load();
            var rawLength = strings.Sum(s => s.Length);
            var modStrings = strings.Select(s => ProcessDecodeString(s)).ToArray();
            var modLength = modStrings.Sum(s => s.Length);

            return rawLength - modLength;
        }

        public static int ProcessEncode()
        {
            var strings = Load();
            var result = strings.Sum(s => s.Count(c => c == '\\') + s.Count(c => c == '"') + 2);
            return result;
        }

        private static string ProcessDecodeString(string source)
        {
            var regex = new Regex(@"\\x[0-9a-fA-F]{2}");
            var result = source.Substring(1, source.Length-2);
            result = regex.Replace(result, "X");
            result = result.Replace("\\\"", "\"");
            result = result.Replace(@"\\", @"\");
            return result;
        }
    }
}

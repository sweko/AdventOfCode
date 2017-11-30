using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day12
{
    class DayTwelve
    {
        private static string Load()
        {
            var result = File.ReadAllText(@"Day12\input.txt");
            //var result = @"{a:5, b:3, d: {e: 'red', f: 7}, g: ['red', {h: 8, i: {j:'red', k:9}}, 10]}";
            return result;
        }

        public static int Process()
        {
            var input = Load();
            var regex = new Regex(@"(-?\d+)");
            var matches = regex.Matches(input);
            var result = matches.Cast<Match>().Sum(m => int.Parse(m.Value));
            return result;
        }

        private static string EvaluateObjectNode(Match match)
        {
            if (match.Value.IndexOf("red") != -1)
            {
                return "0";
            }
            var numRegex = new Regex(@"(-?\d+)");
            var matches = numRegex.Matches(match.Value);
            var result = matches.Cast<Match>().Sum(m => int.Parse(m.Value));
            return result.ToString();
        }

        private static string EvaluateArrayNode(Match match)
        {
            var numRegex = new Regex(@"(-?\d+)");
            var matches = numRegex.Matches(match.Value);
            var result = matches.Cast<Match>().Sum(m => int.Parse(m.Value));
            return result.ToString();
        }

        public static int ProcessRed()
        {
            var input = Load();
            var objRegex = new Regex(@"{[^{}[\]]*}", RegexOptions.Compiled);
            var arrRegex = new Regex(@"\[[^{}[\]]*]", RegexOptions.Compiled);
            while (input[0] == '{' || input[0] == '[')
            {
                input = objRegex.Replace(input, EvaluateObjectNode);
                input = arrRegex.Replace(input, EvaluateArrayNode);
                //Console.WriteLine(input);
            }
            return int.Parse(input);
        }

        public static void ProcessNode(JObject jobject)
        {
            var reds = jobject.Properties().Where(p => p.Value.ToString() == "red").ToList();
            foreach (var red in reds)
            {
                jobject.Remove(red.Name);
            }
            Console.WriteLine(jobject);
        }

        private static void RemoveFieldValue(JToken token, params string[] values)
        {
            JContainer container = token as JContainer;
            if (container == null) return;

            List<JToken> removeList = new List<JToken>();
            foreach (JToken el in container.Children())
            {
                JProperty p = el as JProperty;
                if (p != null && values.Contains(p.Value.ToString()))
                {
                    removeList.Add(el.Parent as JToken);
                }
                RemoveFieldValue(el, values);
            }

            foreach (JToken el in removeList)
            {
                el.Remove();
            }
        }

    }
}

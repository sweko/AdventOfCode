using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AdventOfCode.Common;

namespace AdventOfCode.Day9
{
    public class DayNine
    {
        private static DistanceData Load()
        {
            var lines = File.ReadAllLines(@"Day9\input.txt");
            var regex = new Regex(@"^(\w+) to (\w+) = (\d+)$");
            DistanceData result = new DistanceData();
            foreach (var line in lines)
            {
                var match = regex.Match(line);
                string cityOne = match.Groups[1].Value;
                result.Cities.Add(cityOne);
                string cityTwo = match.Groups[2].Value;
                result.Cities.Add(cityTwo);
                int distance = int.Parse(match.Groups[3].Value);
                result.Distances.Add(Tuple.Create(cityOne, cityTwo), distance);
                result.Distances.Add(Tuple.Create(cityTwo, cityOne), distance);
            }
            return result;
        }

        public static int ProcessShortest()
        {
            var distances = Load();
            var cityPermutations = distances.Cities.GetPermutations();
            var length = int.MaxValue;
            foreach (var permutation in cityPermutations)
            {
                var cities = permutation.ToArray();
                var pathLength = 0;
                for (int i = 0; i < cities.Length - 1; i++)
                {
                    pathLength += distances.Distances[Tuple.Create(cities[i], cities[i + 1])];
                }
                if (pathLength < length)
                    length = pathLength;
            }
            return length;
        }

        public static int ProcessLongest()
        {
            var distances = Load();
            var cityPermutations = distances.Cities.GetPermutations();
            var length = int.MinValue;
            foreach (var permutation in cityPermutations)
            {
                var cities = permutation.ToArray();
                var pathLength = 0;
                for (int i = 0; i < cities.Length - 1; i++)
                {
                    pathLength += distances.Distances[Tuple.Create(cities[i], cities[i + 1])];
                }
                if (pathLength > length)
                    length = pathLength;
            }
            return length;
        }


        private class DistanceData
        {
            public HashSet<string> Cities { get; set; }
            public Dictionary<Tuple<string, string>, int> Distances { get; set; }

            public DistanceData()
            {
                Cities = new HashSet<string>();
                Distances = new Dictionary<Tuple<string, string>, int>();
            }
        }
    }
}

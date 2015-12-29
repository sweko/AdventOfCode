using AdventOfCode.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day13
{
    public class DayThirteen
    {
        private static HappinessData Load()
        {
            var lines = File.ReadAllLines(@"Day13\input.txt");
            var regex = new Regex(@"^(\w*) would (lose|gain) (\d*) happiness units by sitting next to (\w*)\.$");
            HappinessData result = new HappinessData();
            foreach (var line in lines)
            {
                var match = regex.Match(line);
                string personOne = match.Groups[1].Value;
                result.People.Add(personOne);
                string personTwo = match.Groups[4].Value;
                result.People.Add(personTwo);
                int sign = match.Groups[2].Value == "gain" ? 1 : -1;
                int happiness = int.Parse(match.Groups[3].Value) * sign;

                result.Happiness.Add(Tuple.Create(personOne, personTwo), happiness);
            }
            return result;
        }

        public static int MaxHappiness()
        {
            var data = Load();
            return MaxHappinessImpl(data);
        }

        public static int MaxLineHappiness()
        {
            var data = Load();
            foreach (var person in data.People)
            {
                data.Happiness.Add(Tuple.Create("Me", person), 0);
                data.Happiness.Add(Tuple.Create(person, "Me"), 0);
            }
            data.People.Add("Me");
            return MaxHappinessImpl(data);
        }

        private static int MaxHappinessImpl(HappinessData data)
        {
            var tablePermutations = data.People.Skip(1).GetPermutations().Select(p => p.Concat(data.People.Take(1)));
            var maxHappy = int.MinValue;
            foreach (var permutation in tablePermutations)
            {
                var persons = permutation.ToArray();
                var happy = 0;
                for (int i = 0; i < persons.Length - 1; i++)
                {
                    happy += data.Happiness[Tuple.Create(persons[i], persons[i + 1])];
                    happy += data.Happiness[Tuple.Create(persons[i + 1], persons[i])];
                }
                happy += data.Happiness[Tuple.Create(persons[0], persons[persons.Length - 1])];
                happy += data.Happiness[Tuple.Create(persons[persons.Length - 1], persons[0])];

                if (happy > maxHappy)
                    maxHappy = happy;
            }
            return maxHappy;
        }

        private class HappinessData
        {
            public HashSet<string> People { get; set; }
            public Dictionary<Tuple<string, string>, int> Happiness { get; set; }

            public HappinessData()
            {
                People = new HashSet<string>();
                Happiness = new Dictionary<Tuple<string, string>, int>();
            }
        }
    }
}

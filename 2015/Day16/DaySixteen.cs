using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day16
{
    public class DaySixteen
    {
        private static IEnumerable<Sue> auntSues;
        private static void Load()
        {
            var lines = File.ReadAllLines(@"Day16\input.txt");
            auntSues = lines.Select(line => ParseSue(line));
            auntSues.Count();
        }

        private static Sue ParseSue(string suestring)
        {
            Regex basicSue = new Regex(@"Sue (\d*):(.*)");
            var match = basicSue.Match(suestring);
            var index = int.Parse(match.Groups[1].Value);
            var propstring = match.Groups[2].Value;
            Regex propMatch = new Regex(@"([a-z]*): (\d*)");
            var props = propMatch.Matches(propstring).Cast<Match>().Select(m => new { Property = m.Groups[1].Value, Value = int.Parse(m.Groups[2].Value) });

            var sue = new Sue { Index = index };

            foreach (var prop in props)
            {
                switch (prop.Property)
                {
                    case "children":
                        sue.Children = prop.Value;
                        break;
                    case "cats":
                        sue.Cats = prop.Value;
                        break;
                    case "samoyeds":
                        sue.Samoyeds = prop.Value;
                        break;
                    case "pomeranians":
                        sue.Pomeranians = prop.Value;
                        break;
                    case "akitas":
                        sue.Akitas = prop.Value;
                        break;
                    case "vizslas":
                        sue.Vizslas = prop.Value;
                        break;
                    case "goldfish":
                        sue.Goldfish = prop.Value;
                        break;
                    case "trees":
                        sue.Trees = prop.Value;
                        break;
                    case "cars":
                        sue.Cars = prop.Value;
                        break;
                    case "perfumes":
                        sue.Perfumes = prop.Value;
                        break;
                    default:
                        throw new Exception(prop.Property);
                }
            }

            return sue;
        }

        private class Sue
        {
            public int Index { get; set; }
            public int? Children { get; set; }
            public int? Cats { get; set; }
            public int? Samoyeds { get; set; }
            public int? Pomeranians { get; set; }
            public int? Akitas { get; set; }
            public int? Vizslas { get; set; }
            public int? Goldfish { get; set; }
            public int? Trees { get; set; }
            public int? Cars { get; set; }
            public int? Perfumes { get; set; }
        }

        public static int GetSueIndexDirect()
        {
            Load();
            // Console.WriteLine($"Total {auntSues.Count()} before filter");
            auntSues = auntSues.Where(sue => sue.Children == 3 || sue.Children == null);
            // Console.WriteLine($"Total {auntSues.Count()} after children filter");
            auntSues = auntSues.Where(sue => sue.Cats == 7 || sue.Cats == null);
            // Console.WriteLine($"Total {auntSues.Count()} after cats filter");
            auntSues = auntSues.Where(sue => sue.Samoyeds == 2 || sue.Samoyeds == null);
            // Console.WriteLine($"Total {auntSues.Count()} after samoyeds filter");
            auntSues = auntSues.Where(sue => sue.Pomeranians == 3 || sue.Pomeranians == null);
            // Console.WriteLine($"Total {auntSues.Count()} after pomeranians filter");
            auntSues = auntSues.Where(sue => sue.Akitas == 0 || sue.Akitas == null);
            // Console.WriteLine($"Total {auntSues.Count()} after akitas filter");
            auntSues = auntSues.Where(sue => sue.Vizslas == 0 || sue.Vizslas == null);
            // Console.WriteLine($"Total {auntSues.Count()} after viszlas filter");
            auntSues = auntSues.Where(sue => sue.Goldfish == 5 || sue.Goldfish == null);
            // Console.WriteLine($"Total {auntSues.Count()} after golfish filter");
            auntSues = auntSues.Where(sue => sue.Trees == 3 || sue.Trees == null);
            // Console.WriteLine($"Total {auntSues.Count()} after trees filter");
            auntSues = auntSues.Where(sue => sue.Cars == 2 || sue.Cars == null);
            // Console.WriteLine($"Total {auntSues.Count()} after cars filter");
            auntSues = auntSues.Where(sue => sue.Perfumes == 1 || sue.Perfumes == null);
            // Console.WriteLine($"Total {auntSues.Count()} after perfumes filter");
            return auntSues.First().Index;
        }

        public static int GetSueIndexRange()
        {
            Load();
            // Console.WriteLine($"Total {auntSues.Count()} before filter");
            auntSues = auntSues.Where(sue => sue.Children == 3 || sue.Children == null);
            // Console.WriteLine($"Total {auntSues.Count()} after children filter");
            auntSues = auntSues.Where(sue => sue.Cats > 7 || sue.Cats == null);
            // Console.WriteLine($"Total {auntSues.Count()} after cats filter");
            auntSues = auntSues.Where(sue => sue.Samoyeds == 2 || sue.Samoyeds == null);
            // Console.WriteLine($"Total {auntSues.Count()} after samoyeds filter");
            auntSues = auntSues.Where(sue => sue.Pomeranians < 3 || sue.Pomeranians == null);
            // Console.WriteLine($"Total {auntSues.Count()} after pomeranians filter");
            auntSues = auntSues.Where(sue => sue.Akitas == 0 || sue.Akitas == null);
            // Console.WriteLine($"Total {auntSues.Count()} after akitas filter");
            auntSues = auntSues.Where(sue => sue.Vizslas == 0 || sue.Vizslas == null);
            // Console.WriteLine($"Total {auntSues.Count()} after viszlas filter");
            auntSues = auntSues.Where(sue => sue.Goldfish < 5 || sue.Goldfish == null);
            // Console.WriteLine($"Total {auntSues.Count()} after golfish filter");
            auntSues = auntSues.Where(sue => sue.Trees > 3 || sue.Trees == null);
            // Console.WriteLine($"Total {auntSues.Count()} after trees filter");
            auntSues = auntSues.Where(sue => sue.Cars == 2 || sue.Cars == null);
            // Console.WriteLine($"Total {auntSues.Count()} after cars filter");
            auntSues = auntSues.Where(sue => sue.Perfumes == 1 || sue.Perfumes == null);
            Console.WriteLine($"Total {auntSues.Count()} after perfumes filter");
            return auntSues.First().Index;
        }
    }
}

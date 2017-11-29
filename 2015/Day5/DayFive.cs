using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day5
{
    public class DayFive
    {
        public static IEnumerable<string> Load()
        {
            var lines = File.ReadAllLines(@"Day5\input.txt");
            return lines;
        }


        public static int CountNice()
        {
            var words = Load();
            return words.Count(word => word.IsNice());
        }

        public static int CountOtherNice()
        {
            var words = Load();
            return words.Count(word => word.IsOtherNice());
        }

    }

    public static class Extensions
    {
        private static char[] vowels = { 'a', 'e', 'i', 'o', 'u' };
        private static string[] badStrings = { "ab", "cd", "pq", "xy" };
        private static Regex hasRepeatLetter = new Regex(@"([a-z])[a-z]\1");
        private static Regex hasDoublePair = new Regex(@"([a-z][a-z]).*\1");

        public static bool IsNice(this string input)
        {
            return input.HasVowels() && input.HasDouble() && !input.HasBadString();
        }

        public static bool HasVowels(this string input)
        {
            return input.Count(c => vowels.Contains(c)) >= 3;
        }

        public static bool HasDouble(this string input)
        {
            for (int i = 0; i < input.Length - 1; i++)
            {
                if (input[i] == input[i + 1])
                    return true;
            }
            return false;
        }

        public static bool HasBadString(this string input)
        {
            return badStrings.Any(bs => input.IndexOf(bs) != -1);
        }


        public static bool IsOtherNice(this string input)
        {
            return input.HasDoublePair() && input.HasRepeatLetter();
        }

        public static bool HasDoublePair(this string input)
        {
            return hasDoublePair.IsMatch(input);
        }

        public static bool HasRepeatLetter(this string input)
        {
            return hasRepeatLetter.IsMatch(input);
        }

    }
}

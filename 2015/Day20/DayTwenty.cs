using AdventOfCode.Common.Primes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day20
{
    public class DayTwenty
    {
        private static int Limit = 33100000;

        public static int Process()
        {
            var maxSum = 0;
            for (int i = 480; i < Limit; i += 480)
            {
                var divisorsSum = GetDivisors(i).Sum();
                var presents = divisorsSum * 10;
                if (presents >= Limit)
                    return i;
                if (presents > maxSum)
                {
                    maxSum = presents;
                    //Console.WriteLine($"Current champion: {i} with {presents}");
                }
            }
            return 0;
        }

        public static int ProcessWithPrimes()
        {
            var maxSum = 0;
            for (int i = 1; i < Limit; i++)
            {
                var divisorsSum = i.Factorize().GetDivisors().Sum();
                var presents = divisorsSum * 10;
                if (presents > maxSum)
                {
                    maxSum = presents;
                    Console.WriteLine($"Current champion: {i} with {presents}");
                }
                if (presents >= Limit)
                    return i;
            }
            return 0;
        }


        public static int Process2WithPrimes()
        {
            var maxSum = 0;
            for (int i = 1; i < Limit; i++)
            {
                var divisorsSum = i.Factorize().GetDivisors().Where(d => d * 50 >= i).Sum();
                var presents = divisorsSum * 11;
                if (presents > maxSum)
                {
                    maxSum = presents;
                    Console.WriteLine($"Current champion: {i} with {presents}");
                }
                if (presents >= Limit)
                    return i;
            }
            return 0;
        }


        private static List<int> GetDivisors(int number)
        {
            var result = new List<int> { 1 };
            for (int i = 2; i <= number / 2; i++)
            {
                if (number % i == 0)
                    result.Add(i);
            }
            result.Add(number);
            return result;
        }

        private static List<int> GeneratePrimes(int limit)
        {
            var result = new List<int> { 2, 3 };
            for (int i = 5; i < limit; i += 2)
            {
                var ii = (int)Math.Sqrt(i);
                if (result.TakeWhile(p => p < ii).Any(p => i % p == 0))
                    continue;
                result.Add(i);
            }
            return result;
        }
    }
}

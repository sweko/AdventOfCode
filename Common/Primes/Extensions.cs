using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Common.Primes
{
    public static class Extensions
    {
        private static int[] primes = GeneratePrimes(1000);

        private static int[] GeneratePrimes(int limit)
        {
            var result = new List<int> { 2, 3 };
            for (int i = 5; i < limit; i += 2)
            {
                var ii = (int)Math.Sqrt(i);
                if (result.TakeWhile(p => p < ii).Any(p => i % p == 0))
                    continue;
                result.Add(i);
            }
            return result.ToArray();
        }

        public static FactorCollection Factorize(this int number)
        {
            var index = 0;
            FactorCollection result = new FactorCollection();
            while ((number != 1) && (index < primes.Length))
            {
                var prime = primes[index];
                if (number % prime == 0)
                {
                    if ((result.Count == 0) || (result[result.Count - 1].Prime != prime))
                    {
                        result.Add(new Factor { Prime = prime, Cardinality = 1 });
                    }
                    else
                    {
                        result[result.Count - 1].Cardinality++;
                    }
                    number /= prime;
                }
                else
                {
                    index++;
                }
            }
            if (number != 1)
                result.Add(new Factor { Prime = number, Cardinality = 1 });
            return result;
        }

    }
}

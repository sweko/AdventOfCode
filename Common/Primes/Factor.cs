using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Common.Primes
{
    public class Factor
    {
        public int Prime { get; set; }
        public int Cardinality { get; set; }

        public int Value
        {
            get
            {
                return Enumerable.Repeat(Prime, Cardinality).Multiply();
            }
        }

        public override string ToString()
        {
            return $"{Prime}^{Cardinality}";
        }

        public IEnumerable<int> GetDivisors()
        {
            var value = 1;
            var result = new List<int> { 1 };
            for (int i = 0; i < Cardinality; i++)
            {
                value *= Prime;
                result.Add(value);
            }
            return result;
        }
    }
}

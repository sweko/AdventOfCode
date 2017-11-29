using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Common.Primes
{
    public class FactorCollection : List<Factor>
    {
        public FactorCollection():base() { }

        public FactorCollection(IEnumerable<Factor> factors) : base(factors) { }

        public FactorCollection(Factor factor) : base(new List<Factor> { factor }) { }

        public int Value
        {
            get
            {
                return this.Select(f => f.Value).Multiply();
            }
        }

        public IEnumerable<int> GetDivisors()
        {
            if (Count == 0)
            {
                return new List<int>();
            }
            var firstDivisors = this[0].GetDivisors();
            if (Count == 1)
            {
                return firstDivisors;
            }
            
            var restDivisors = new FactorCollection(this.Skip(1)).GetDivisors();

            var divisors = from d1 in firstDivisors
                           from d2 in restDivisors
                           select d1 * d2;
            return divisors.OrderBy(d => d);
        }

        public int DivisorsCount
        {
            get
            {
                return this.Select(f => f.Cardinality + 1).Multiply();
            }
        }

        public override string ToString()
        {
            return string.Join(" * ", this);
        }


    }
}

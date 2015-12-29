using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Common
{
    public static class Extensions
    {
        public static IEnumerable<IEnumerable<T>> GetPermutations<T>(this IEnumerable<T> source)
            where T: IEquatable<T>
        {
            if (source.Count() == 1)
                return new List<IEnumerable<T>> { source };

            var result = new List<IEnumerable<T>>();

            foreach (var element in source)
            {
                var rest = source.Where(item => !item.Equals(element));
                result.AddRange(rest.GetPermutations().Select(p => (new List<T> { element }).Concat(p)));
            }
            return result;
        }

        public static int Multiply(this IEnumerable<int> source)
        {
            var result = 1;
            foreach (var item in source)
            {
                result *= item;
            }
            return result;
        }

        public static long MultiplyLong(this IEnumerable<int> source)
        {
            var result = 1L;
            foreach (var item in source)
            {
                result *= item;
            }
            return result;
        }
    }
}

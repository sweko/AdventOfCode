using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode
{
    public static class Extensions
    {
        public static int? ParseInt(this string value)
        {
            int result;
            if (int.TryParse(value, out result))
                return result;
            return null;
        }

        public static IEnumerable<T> FilterNulls<T>(this IEnumerable<T?> source) where T : struct
        {
            return source.Where(item => item.HasValue).Select(item => item.Value);
        }


        public static IEnumerable<int> ParseIntValues(this IEnumerable<string> source)
        {
            return source.Select(ParseInt).FilterNulls();
        }

    }
}

// using System;
// using System.Collections.Generic;
// using System.Diagnostics;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace AdventOfCode
// {
//     class Program
//     {
//         static void Main(string[] args)
//         {
//             Stopwatch s = Stopwatch.StartNew();
//             var result = Day22.DayTwentyTwo.Simulate();
//             Console.WriteLine(result);
//             s.Stop();
//             Console.WriteLine(s.ElapsedMilliseconds);
//         }
//     }
// }

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Day07
{
    public class Program_07
    {
        public static void Main(string[] args)
        {
            string source = File.ReadAllText(@"..\2016\input\day-07.txt");
            List<string> instructions = source.Split('\n').ToList();

            int countSupportingTLS = instructions
               .Select(i => i.Split('[', ']'))
               .Select(i => new List<IEnumerable<bool>>
               {
                   i.Where((c, a) => a % 2 == 0).Select(a => HasABBA(a)),
                   i.Where((c, a) => a % 2 != 0).Select(a => HasABBA(a))
               }).Count(i => i[0].Any(a => a) && i[1].All(a => !a));

            var xxx = instructions
               .Select(i => new {i, j=i.Split('[', ']')})
               .Select(i => new {i, k = new List<IEnumerable<bool>>
               {
                   i.j.Where((c, a) => a % 2 == 0).Select(a => HasABBA(a)),
                   i.j.Where((c, a) => a % 2 != 0).Select(a => HasABBA(a))
               }}).Where(i => i.k[0].Any(a => a) && i.k[1].All(a => !a))
               .Select(i => i.i.i);

               foreach (var x in xxx)
               {
                   Console.WriteLine(x);
               }

            int countSupportingSSL = instructions
               .Select(i => i.Split('[', ']'))
               .Select(i => new List<IEnumerable<string>>
               {
                   i.Where((c, a) => a % 2 == 0)
                   .SelectMany(a => GetABA(a))
                   .Select(aba => ConvertABAToBAB(aba)),
                   i.Where((c, a) => a % 2 != 0)
               }).Count(i => ContainsBAB(i[0], i[1]));


            Console.WriteLine("Part one = {0}", countSupportingTLS);
            Console.WriteLine("Part two = {0}", countSupportingSSL);
            Console.ReadLine();
        }        

        public static string ConvertABAToBAB(string aba)
        {
            return string.Join("", aba[1], aba[0], aba[1]);
        }

        public static bool ContainsBAB(IEnumerable<string> abaList, IEnumerable<string> hypernetSequences)
        {
            foreach (string hypernetSequence in hypernetSequences)
            {
                if (abaList.Any(hypernetSequence.Contains))
                {
                    return true;
                }
            }
            return false;
        }

        public static List<string> GetABA(string supernetSequence)
        {
            List<string> abaList = new List<string>();
            for (int i = 0; i < supernetSequence.Length - 2; i++)
            {
                if (supernetSequence[i] == supernetSequence[i + 2] && supernetSequence[i] != supernetSequence[i + 1])
                {
                    abaList.Add(string.Join("", supernetSequence[i], supernetSequence[i + 1], supernetSequence[i + 2]));
                }
            }
            return abaList;
        }

        public static bool HasABBA(string sequence)
        {
            for (int i = 0; i < sequence.Length - 3; i++)
            {
                if (sequence[i] == sequence[i + 3] && sequence[i + 1] == sequence[i + 2] && sequence[i] != sequence[i + 1])
                {
                    return true;
                }
            }
            return false;
        }
    }
}
using AdventOfCode.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day24
{
    class DayTwentyFour
    {
        internal static int Process()
        {
            var weights = File.ReadAllLines(@"Day24\input.txt").Select(l => int.Parse(l)).Reverse().ToArray();
            //part1
            //var partWeight = weights.Sum() / 3;
            //part2 
            var partWeight = weights.Sum() / 4;

            var limit = (int)Math.Pow(2, weights.Length);
            //var firstBag = new List<int> { weights[1] };
            var resultCount = 0;
            List<int> bestResult = Enumerable.Range(1, 100).ToList();
            for (int i = 0; i < limit; i++)
            {
                var result = new List<int>();
                var sum = 0;
                for (int j = 0; j < weights.Length; j++)
                {
                    if (((int)Math.Pow(2, j) & i) != 0)
                    {
                        sum += weights[j];
                        result.Add(weights[j]);
                        if (sum >= partWeight)
                            break;
                    }
                }
                if (i % 12347 == 0)
                {
                    Console.CursorTop = 0;
                    Console.CursorLeft = 0;
                    Console.WriteLine("Procesing item #{0:N0}",i);
                }
                if (sum == partWeight)
                {
                    resultCount++;
                    Console.CursorTop = 1;
                    Console.CursorLeft = 0;
                    Console.WriteLine("Total {0:N0} matching combinations", resultCount);

                    if (bestResult.Count > result.Count)
                    {
                        bestResult = result;
                        Console.WriteLine("Best result so far: {0} with score of {1:N0}                                 ", string.Join(", ", bestResult), bestResult.MultiplyLong());
                    }
                    else if (bestResult.Count == result.Count)
                    {
                        var bestqe = bestResult.MultiplyLong();
                        var resultqe = result.MultiplyLong();
                        if (bestqe > resultqe)
                            bestResult = result;
                        Console.WriteLine("Best result so far: {0} with score of {1:N0}                                 ", string.Join(", ", bestResult), bestResult.MultiplyLong());
                    }
                }
            }

            return 0;
        }
    }
}

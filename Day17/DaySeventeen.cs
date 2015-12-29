using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day17
{
    public class DaySeventeen
    {
        internal static int FillContainers()
        {
            var data = File.ReadAllLines(@"Day17\input.txt").Select(l => int.Parse(l)).ToList();
            var limit = (int)Math.Pow(2, data.Count);
            var count = 0;
            var total = 150;
            for (int i = 0; i < limit; i++)
            {
                var sum = 0;
                for (int j = 0; j < data.Count; j++)
                {
                    if (((int)Math.Pow(2, j) & i) != 0)
                    {
                        sum += data[j];
                        if (sum > total)
                            break;
                    }
                }
                if (sum == total)
                    count++;
            }
            return count;
        }

        internal static int FillContainersMin()
        {
            var data = File.ReadAllLines(@"Day17\input.txt").Select(l => int.Parse(l)).ToList();
            var limit = (int)Math.Pow(2, data.Count);
            var numberCounts = new Dictionary<int, int>();
            var total = 150;
            for (int i = 0; i < limit; i++)
            {
                var sum = 0;
                var number = 0;
                for (int j = 0; j < data.Count; j++)
                {
                    if (((int)Math.Pow(2, j) & i) != 0)
                    {
                        sum += data[j];
                        number++;
                        if (sum > total)
                            break;
                    }
                }
                if (sum == total)
                {
                    if (numberCounts.ContainsKey(number))
                        numberCounts[number]++;
                    else
                        numberCounts.Add(number, 1);
                }
            }
            return numberCounts[numberCounts.Keys.Min()];
        }
    }
}

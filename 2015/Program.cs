using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode
{
    class Program
    {
        static void Main(string[] args)
        {
            Stopwatch s = Stopwatch.StartNew();
            var result = Day5.DayFive.CountNice();
            Console.WriteLine(result);
            result = Day5.DayFive.CountOtherNice();
            Console.WriteLine(result);
            s.Stop();
            Console.WriteLine(s.ElapsedMilliseconds);
        }
    }
}

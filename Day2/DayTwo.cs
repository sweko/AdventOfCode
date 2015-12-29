using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day2
{
    public class DayTwo
    {
        public static IEnumerable<Box> Load()
        {
            var lines = File.ReadAllLines(@"Day2\input.txt");
            var result = lines.Select(line => line.Split('x').ParseIntValues().ToArray())
                              .Select(sizes => new Box(sizes[0], sizes[1], sizes[2]));
            return result;
        }

        public static long SumPackaging()
        {
            var boxes = Load();
            return boxes.Sum(b => b.Packaging);
        }

        public static long SumWrap()
        {
            var boxes = Load();
            return boxes.Sum(b => b.Volume + b.WrapLength);
        }

        public class Box
        {
            public Box(int height, int width, int depth)
            {
                Height = height;
                Width = width;
                Depth = depth;
            }

            public int Height { get; set; }
            public int Width { get; set; }
            public int Depth { get; set; }

            public int Extra
            {
                get
                {
                    int[] areas = { Height * Width, Width * Depth, Depth * Height };
                    return areas.Min();
                }
            }

            public int Packaging
            {
                get
                {
                    return 2 * Height * Width + 2 * Width * Depth + 2 * Depth * Height + Extra;
                }
            }

            public int Volume
            {
                get
                {
                    return Height * Width * Depth;
                }
            }

            public int WrapLength
            {
                get
                {
                    int[] sizes = { Height, Width, Depth };
                    return 2 * sizes.OrderBy(s => s).Take(2).Sum();
                }
            }


        }
    }

    
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day18
{
    class DayEighteen
    {
        internal static int AnimateLights()
        {
            int[,] array = LoadArray();
            var times = 100;
            for (int i = 0; i < times; i++)
            {
                array = Animate(array);
            }
            return SumArray(array);
        }

        internal static int AnimateStuckLights()
        {
            int[,] array = LoadArray();

            var low = 1;
            var high = array.GetLength(0) - 2;
            array[low, low] = 1;
            array[high, low] = 1;
            array[low, high] = 1;
            array[high, high] = 1;

            var times = 100;
            for (int i = 0; i < times; i++)
            {
                array = AnimateStuck(array);
            }
            return SumArray(array);
        }

        private static int[,] AnimateStuck(int[,] array)
        {
            var result = Animate(array);
            var low = 1;
            var high = array.GetLength(0) - 2;
            result[low, low] = 1;
            result[high, low] = 1;
            result[low, high] = 1;
            result[high, high] = 1;
            return result;
        }

        private static int SumArray(int[,] array)
        {
            var sum = 0;
            for (int i = 0; i < array.GetLength(0); i++)
            {
                for (int j = 0; j < array.GetLength(1); j++)
                {
                    sum += array[i, j];
                }
            }
            return sum;
        }

        private static int[,] LoadArray()
        {
            var lines = File.ReadAllLines(@"Day18\input.txt");
            var array = new int[lines.Length + 2, lines.Length + 2];
            for (int i = 0; i < lines.Length; i++)
            {
                var line = lines[i];
                for (int j = 0; j < line.Length; j++)
                {
                    array[i + 1, j + 1] = (line[j] == '#') ? 1 : 0;
                }
            }

            return array;
        }

        private static int[,] Animate(int[,] array)
        {
            var m = array.GetLength(0);
            var n = array.GetLength(1);
            var result = new int[m, n];
            for (int i = 1; i < m - 1; i++)
            {
                for (int j = 1; j < n - 1; j++)
                {
                    var sum = array[i - 1, j - 1] + array[i, j - 1] + array[i + 1, j - 1] + array[i - 1, j]
                        + array[i + 1, j] + array[i - 1, j + 1] + array[i, j + 1] + array[i + 1, j + 1];
                    if (array[i, j] == 1)
                    {
                        if ((sum == 2) || (sum == 3))
                            result[i, j] = 1;
                        else
                            result[i, j] = 0;
                    }
                    else
                    {
                        if (sum == 3)
                            result[i, j] = 1;
                        else
                            result[i, j] = 0;
                    }
                }
            }
            return result;
        }
    }
}

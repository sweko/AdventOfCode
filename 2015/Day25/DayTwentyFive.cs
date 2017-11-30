using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day25
{
    class DayTwentyFive
    {
        public static int Row = 3010;
        public static int Column = 3019;
        //public static int Row = 6;
        //public static int Column = 2;

        public static int Start = 20151125;
        public static int Multiplier = 252533;
        public static int Modulo = 33554393;

        public static int Process()
        {
            int row = 1;
            int column = 1;
            int[,] values = new int[Row + Column, Row + Column];
            values[1, 1] = Start;
            var value = Start;

            while (row != Row || column != Column)
            {
                if (row == 1)
                {
                    row = column + 1;
                    column = 1;
                    //Console.CursorTop = 0;
                    //Console.CursorLeft = 0;
                    //Console.WriteLine($"Processing row {row}");
                }
                else
                {
                    row--;
                    column++;
                }
                value = (int)(((long)value * Multiplier) % Modulo);
                values[row, column] = value;
            }

            //for (int i = 1; i < values.GetLength(0); i++)
            //{
            //    for (int j = 1; j < values.GetLength(1); j++)
            //    {
            //        Console.Write("\t{0}", values[i, j]);
            //    }
            //    Console.WriteLine();
            //}

            return values[Row, Column];
        }

    }
}

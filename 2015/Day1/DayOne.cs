using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day1
{
    public class DayOne
    {
        public static string Load()
        {
            var parens = File.ReadAllText(@"Day1\input.txt");
            return parens;
        }

        public static int CountFloors(string parens)
        {
            return parens.Count(c => c == '(') - parens.Count(c => c == ')');
        }

        public static int GetBasementIndex(string parens)
        {
            int position = 0;
            int index = 0;
            while (position >= 0)
            {
                if (parens[index] == '(')
                {
                    position+=1;
                }
                else
                {
                    position-=1;
                }
                index++;
            }
            return index;
        }


    }


}

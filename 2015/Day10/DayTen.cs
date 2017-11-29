using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day10
{
    public class DayTen
    {
        public static string GetNextValue(string number, int iterations)
        {
            byte[] bytes = new byte[number.Length];
            for (int i = 0; i < number.Length; i++)
            {
                bytes[i] = (byte)(number[i] - '0');
            }

            for (int i = 0; i < iterations; i++)
            {
                bytes = GetNextValue(bytes);
            }

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                sb.Append(bytes[i]);
            }
            return sb.ToString();
        }

        public static byte[] GetNextValue(byte[] number)
        {
            var groups = new RunLengthDataB(number);
            return groups.ToByteArray();
        }


        public static string GetNextValue(string number)
        {
            var groups = new RunLengthData(number);
            return groups.ToString();
        }

        public class RunLengthData
        {
            public class Digit
            {
                public char Value { get; set; }
                public int Frequency { get; set; }

                public Digit(char value)
                {
                    Value = value;
                    Frequency = 1;
                }
            }

            private List<Digit> digits;

            public RunLengthData(string number)
            {
                digits = new List<Digit>();
                var currentDigit = new Digit(number[0]);
                digits.Add(currentDigit);
                for (int i = 1; i < number.Length; i++)
                {
                    if (number[i] == currentDigit.Value)
                    {
                        currentDigit.Frequency++;
                    }
                    else
                    {
                        currentDigit = new Digit(number[i]);
                        digits.Add(currentDigit);
                    }
                }
            }

            public override string ToString()
            {
                StringBuilder sb = new StringBuilder();
                foreach (var digit in digits)
                {
                    sb.Append(digit.Frequency);
                    sb.Append(digit.Value);
                }
                return sb.ToString();
            }
        }

        public class RunLengthDataB
        {
            public class Digit
            {
                public byte Value { get; set; }
                public byte Frequency { get; set; }

                public Digit(byte value)
                {
                    Value = value;
                    Frequency = 1;
                }
            }

            private List<Digit> digits;

            public RunLengthDataB(byte[] number)
            {
                digits = new List<Digit>();
                var currentDigit = new Digit(number[0]);
                digits.Add(currentDigit);
                for (int i = 1; i < number.Length; i++)
                {
                    if (number[i] == currentDigit.Value)
                    {
                        currentDigit.Frequency++;
                    }
                    else
                    {
                        currentDigit = new Digit(number[i]);
                        digits.Add(currentDigit);
                    }
                }
            }

            public byte[] ToByteArray()
            {
                byte[] result = new byte[digits.Count * 2];
                var index = 0;
                foreach (var digit in digits)
                {
                    result[index++] = digit.Frequency;
                    result[index++] = digit.Value;
                }
                return result;
            }
        }

    }
}

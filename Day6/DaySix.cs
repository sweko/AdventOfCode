using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day6
{
    public class DaySix
    {
        public class Command
        {
            private static Dictionary<string, CommandType> TypeResolver = new Dictionary<string, CommandType>
            {
                { "turn on", CommandType.TurnOn},
                { "turn off", CommandType.TurnOff},
                { "toggle", CommandType.Toggle},
            };

            public CommandType Type { get; set; }
            public int Left { get; set; }
            public int Bottom { get; set; }
            public int Right { get; set; }
            public int Top { get; set; }

            public Command(string commandLine)
            {
                var regex = new Regex(@"^(.*) (\d{1,3}),(\d{1,3}) through (\d{1,3}),(\d{1,3})$");
                var match = regex.Match(commandLine);
                var values = match.Groups.Cast<Group>().Skip(1).Select(g => g.Value).ToArray();
                Type = TypeResolver[values[0]];
                Left = int.Parse(values[1]);
                Bottom = int.Parse(values[2]);
                Right = int.Parse(values[3]);
                Top = int.Parse(values[4]);
            }
        }

        public enum CommandType
        {
            TurnOn,
            TurnOff,
            Toggle
        }

        public static IEnumerable<Command> Load()
        {
            var lines = File.ReadAllLines(@"Day6\input.txt");
            var result = lines.Select(line => new Command(line));
            return result;
        }

        public static int CountLitLights()
        {
            var size = 1000;
            var commands = Load();
            var lights = new bool[size, size];
            foreach (var command in commands)
            {
                Operate(command, lights);
            }
            var count = 0;
            for (int i = 0; i < size; i++)
            {
                for (int j = 0; j < size; j++)
                {
                    if (lights[i, j]) count++;
                }
            }
            return count;
        }

        private static void Operate(Command command, bool[,] lights)
        {
            for (int i = command.Left; i <= command.Right; i++)
            {
                for (int j = command.Bottom; j <= command.Top; j++)
                {
                    switch (command.Type)
                    {
                        case CommandType.TurnOn:
                            lights[i, j] = true;
                            break;
                        case CommandType.TurnOff:
                            lights[i, j] = false;
                            break;
                        case CommandType.Toggle:
                            lights[i, j] = !lights[i, j];
                            break;
                    }
                }
            }
        }

        public static int CountBrightLights()
        {
            var size = 1000;
            var commands = Load();
            var lights = new int[size, size];
            foreach (var command in commands)
            {
                Operate(command, lights);
            }
            var count = 0;
            for (int i = 0; i < size; i++)
            {
                for (int j = 0; j < size; j++)
                {
                    count += lights[i, j];
                }
            }
            return count;
        }

        private static void Operate(Command command, int[,] lights)
        {
            for (int i = command.Left; i <= command.Right; i++)
            {
                for (int j = command.Bottom; j <= command.Top; j++)
                {
                    switch (command.Type)
                    {
                        case CommandType.TurnOn:
                            lights[i, j] += 1;
                            break;
                        case CommandType.TurnOff:
                            lights[i, j] -= 1;
                            if (lights[i, j] < 0)
                                lights[i, j] = 0;
                            break;
                        case CommandType.Toggle:
                            lights[i, j] += 2;
                            break;
                    }
                }
            }
        }
    }
}

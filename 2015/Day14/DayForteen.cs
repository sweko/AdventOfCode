using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day14
{
    public class DayForteen
    {
        private static IEnumerable<Reindeer> Load()
        {
            var lines = File.ReadAllLines(@"Day14\input.txt");
            var regex = new Regex(@"^(\w*) can fly (\d*) km\/s for (\d*) seconds, but then must rest for (\d*) seconds\.$");
            var result = new List<Reindeer>();
            foreach (var line in lines)
            {
                var match = regex.Match(line);
                var reindeer = new Reindeer(match.Groups[1].Value, int.Parse(match.Groups[2].Value), int.Parse(match.Groups[3].Value), int.Parse(match.Groups[4].Value));
                result.Add(reindeer);
            }
            return result;
        }

        public static int RaceReindeer()
        {
            var herd = Load();
            var time = 2503;
            var maxDistance = herd.Select(rd => rd.GetDistanceAt(time)).Max();
            return maxDistance;
        }

        public static int RaceReindeerPoints()
        {
            var herd = Load();
            var time = 2503;
            for (int moment = 1; moment <= time; moment++)
            {
                var topDistance = herd.Select(rd => rd.GetDistanceAt(moment)).Max();
                var leaders = herd.Where(rd => rd.GetDistanceAt(moment) == topDistance);
                foreach (var reindeer in leaders)
                {
                    reindeer.AddPoint();
                }
            }
            var maxPoints = herd.Select(rd => rd.Points).Max();
            return maxPoints;
        }


        private class Reindeer
        {
            public string Name { get; private set; }
            public int Speed { get; private set; }
            public int FlightTime { get; private set; }
            public int RestTime { get; private set; }

            public int Points { get; private set; }

            public Reindeer(string name, int speed, int flightTime, int restTime)
            {
                Name = name;
                Speed = speed;
                FlightTime = flightTime;
                RestTime = restTime;
            }

            public int CycleTime
            {
                get
                {
                    return FlightTime + RestTime;
                }
            }

            public int DistancePerCycle
            {
                get
                {
                    return Speed * FlightTime;
                }
            }

            public int GetDistanceAt(int time)
            {
                var cycles = time / CycleTime;
                var remainTime = time % CycleTime;
                if (remainTime >= FlightTime)
                {
                    cycles++;
                    remainTime = 0;
                }

                var result = cycles * DistancePerCycle + remainTime * Speed;
                return result;
            }

            public int AddPoint()
            {
                Points++;
                return Points;
            }
        }
    }
}

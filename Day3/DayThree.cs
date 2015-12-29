using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day3
{
    public class DayThree
    {
        public static Dictionary<char, Direction> DirectionMap = new Dictionary<char, Direction>
        {
            { '^', Direction.Up },
            {'<', Direction.Left },
            { 'v', Direction.Down },
            { '>', Direction.Right }
        };
        public static Dictionary<Direction, Func<Point, Point>> PointMover = new Dictionary<Direction, Func<Point, Point>>
        {
            {Direction.Up, p => new Point(p.Latitude + 1, p.Longitude) },
            {Direction.Down, p => new Point(p.Latitude - 1, p.Longitude) },
            {Direction.Left, p => new Point(p.Latitude, p.Longitude-1) },
            {Direction.Right, p => new Point(p.Latitude, p.Longitude+1) }
        };

        public static IEnumerable<Direction> Load()
        {
            var line = File.ReadAllText(@"Day3\input.txt");
            var result = line.Select(c => DirectionMap[c]);
            return result;
        }

        public static int CountDistinct()
        {
            var directions = Load();
            var location = new Point(0, 0);
            var result = new HashSet<Point> { location };
            foreach (var direction in directions)
            {
                location = PointMover[direction](location);
                result.Add(location);
            }
            return result.Count;
        }

        public static int CountDistinctWithRobot()
        {
            var directions = Load();
            var santaDirections = directions.Where((d, i) => i % 2 == 0);
            var robotDirections = directions.Where((d, i) => i % 2 == 1);
            var location = new Point(0, 0);
            var result = new HashSet<Point> { location };
            foreach (var direction in santaDirections)
            {
                location = PointMover[direction](location);
                result.Add(location);
            }
            location = new Point(0, 0);
            foreach (var direction in robotDirections)
            {
                location = PointMover[direction](location);
                result.Add(location);
            }
            return result.Count;
        }

        public struct Point
        {
            public Point(int latitude, int longitude)
            {
                Latitude = latitude;
                Longitude = longitude;
            }

            public int Latitude { get; private set; }
            public int Longitude { get; private set; }
        }

        public enum Direction
        {
            Up,
            Down,
            Left,
            Right
        }
    }
}

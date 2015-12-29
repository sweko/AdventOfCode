using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day7
{
    public class DaySeven
    {
        public static IEnumerable<Assignment> Load()
        {
            var lines = File.ReadAllLines(@"Day7\input.txt");
            var result = lines.Select(line => Assignment.Parse(line));
            return result;
        }

        public static ushort Process()
        {
            var expressions = Load().ToList();
            return ProcessImpl(expressions);
        }

        public static ushort Process2()
        {
            var expressions = Load().ToList();
            var result = ProcessImpl(expressions);
            //reset expressions;
            expressions = Load().ToList();
            //set b to result
            var bexp = expressions.Single(ex => ex.Variable == "b");
            bexp.Expression = Expression.Parse(result.ToString());
            return ProcessImpl(expressions);
        }

        private static ushort ProcessImpl(List<Assignment> expressions)
        {
            var calculated = new Dictionary<string, ushort>();
            while (calculated.Count != expressions.Count)
            {
                var calculable = expressions.Where(ex => ex.Expression.CanEvaluate() && ex.Value == null);
                foreach (var assignment in calculable)
                {
                    assignment.Value = assignment.Expression.GetValue();
                    calculated.Add(assignment.Variable, assignment.Value.Value);
                }
                foreach (var assignment in expressions)
                {
                    if (calculated.ContainsKey(assignment.Expression.FirstArgument))
                    {
                        assignment.Expression.FirstArgument = calculated[assignment.Expression.FirstArgument].ToString();
                    }
                    if (assignment.Expression.SecondArgument != null)
                    {
                        if (calculated.ContainsKey(assignment.Expression.SecondArgument))
                        {
                            assignment.Expression.SecondArgument = calculated[assignment.Expression.SecondArgument].ToString();
                        }
                    }
                }
            }
            return calculated["a"];
        }
    }
}

using System;
using System.Collections.Generic;

namespace AdventOfCode.Day7
{
    public class Expression
    {
        private static Dictionary<Operator, Func<ushort, ushort, ushort>> Evaluator = new Dictionary<Operator, Func<ushort, ushort, ushort>>
        {
            {Operator.Identity, (value, _) => value},
            {Operator.Negation, (value, _) => (ushort)(~value)},
            {Operator.And, (first, second) => (ushort)(first & second) },
            {Operator.Or, (first, second) => (ushort)(first | second) },
            {Operator.ShiftLeft, (first, second) => (ushort)(first << second) },
            {Operator.ShiftRight, (first, second) => (ushort)(first >> second) },
        };

        private static Dictionary<string, Operator> OperatorResolver = new Dictionary<string, Operator>
        {
            {"NOT", Operator.Negation },
            {"AND", Operator.And },
            {"OR", Operator.Or },
            {"LSHIFT", Operator.ShiftLeft },
            {"RSHIFT", Operator.ShiftRight },
        };

        private Expression()
        {

        }

        public Operator Operator { get; set; }
        public string FirstArgument { get; set; }
        public string SecondArgument { get; set; }

        public bool CanEvaluate()
        {
            if (SecondArgument == null)
            {
                //unary operation
                ushort value;
                return ushort.TryParse(FirstArgument, out value);
            }
            else
            {
                ushort value;
                if (!ushort.TryParse(FirstArgument, out value))
                    return false;
                return ushort.TryParse(SecondArgument, out value);
            }
        }

        public ushort GetValue()
        {
            var first = ushort.Parse(FirstArgument);
            var second = SecondArgument == null ? (ushort)0 : ushort.Parse(SecondArgument);
            return Evaluator[Operator](first, second);
        }

        public static Expression Parse(string expression)
        {
            var parts = expression.Split(' ');
            if (parts.Length == 1)
            {
                //direct assignment
                return new Expression
                {
                    Operator = Operator.Identity,
                    FirstArgument = parts[0],
                    SecondArgument = null
                };
            }
            else if (parts.Length == 2)
            {
                //only negation
                var operation = OperatorResolver[parts[0]];
                return new Expression
                {
                    Operator = operation,
                    FirstArgument = parts[1],
                    SecondArgument = null,
                };
            }
            else if (parts.Length == 3)
            {
                //binary operation
                var operation = OperatorResolver[parts[1]];
                return new Expression
                {
                    Operator = operation,
                    FirstArgument = parts[0],
                    SecondArgument = parts[2],
                };
            }
            else
                throw new ArgumentException("expression");
        }

        public override string ToString()
        {
            return $"{FirstArgument} {Operator} {SecondArgument}";
        }
    }


}
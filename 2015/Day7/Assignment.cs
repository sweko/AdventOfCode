namespace AdventOfCode.Day7
{
    public class Assignment
    {
        public Expression Expression { get; set; }
        public string Variable { get; set; }
        public ushort? Value { get; set; }

        private Assignment() {}

        public static Assignment Parse(string expression)
        {
            var asspos = expression.IndexOf("->");
            var initExpression = expression.Substring(0, asspos - 1).Trim();
            var variable = expression.Substring(asspos + 2).Trim();
            return new Assignment
            {
                Expression = Expression.Parse(initExpression),
                Variable = variable,
                Value = null
            };
        }

        public override string ToString()
        {
            return $"{Variable} := {Expression}";
        }
    }
}
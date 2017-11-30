using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day23
{
    public class DayTwentyThree
    {
        public static uint Emulate()
        {
            var machine = new Machine('a', 'b');

            var instructionDictionary = new Dictionary<string, Func<char, int, IInstruction>>
            {
                {"hlf", (register, offset) => new HalfInstruction(machine, register)},
                {"tpl", (register, offset) => new TripleInstruction(machine, register)},
                {"inc", (register, offset) => new IncrementInstruction(machine, register)},
                {"jmp", (register, offset) => new JumpInstruction(machine, offset)},
                {"jie", (register, offset) => new JumpEvenInstruction(machine, register, offset)},
                {"jio", (register, offset) => new JumpOneInstruction(machine, register, offset)}
            };
            var program = Program.LoadFromFile(instructionDictionary, @"Day23\input.txt");

            //part2
            //machine.Registers['a'].Value = 1;

            machine.Execute(program);
            return machine.Registers['b'].Value;
        }

    }

    #region instructions
    public interface IInstruction
    {
        string Mnemonic { get; }
        Machine Machine { get; }
        char Register { get; }
        int Offset { get; }
        void Execute();
    }

    public abstract class SingleRegisterInstruction : IInstruction
    {
        public int Offset
        {
            get
            {
                throw new NotSupportedException();
            }
        }

        public char Register { get; private set; }
        public Machine Machine { get; private set; }

        public abstract string Mnemonic { get; }
        public abstract void Execute();

        public SingleRegisterInstruction(Machine machine, char register)
        {
            Machine = machine;
            Register = register;
        }

        public override string ToString()
        {
            return $"{Mnemonic} {Register}";
        }

    }

    public class HalfInstruction : SingleRegisterInstruction
    {
        public override string Mnemonic { get { return "hlf"; } }
        public override void Execute()
        {
            Machine.Registers[Register].Value /= 2;
        }

        public HalfInstruction(Machine machine, char register) : base(machine, register) { }

    }

    public class TripleInstruction : SingleRegisterInstruction
    {
        public override string Mnemonic { get { return "tpl"; } }
        public override void Execute()
        {
            Machine.Registers[Register].Value *= 3;
        }

        public TripleInstruction(Machine machine, char register) : base(machine, register) { }
    }

    public class IncrementInstruction : SingleRegisterInstruction
    {
        public override string Mnemonic { get { return "inc"; } }
        public override void Execute()
        {
            Machine.Registers[Register].Value += 1;
        }

        public IncrementInstruction(Machine machine, char register) : base(machine, register) { }
    }

    public class JumpInstruction : IInstruction
    {
        public Machine Machine { get; private set; }
        public virtual string Mnemonic { get { return "jmp"; } }
        public int Offset { get; private set; }
        public virtual char Register
        {
            get
            {
                throw new NotSupportedException();
            }
            protected set
            {
                throw new NotSupportedException();
            }
        }

        public virtual void Execute()
        {
            Machine.SetPointer((uint)(Machine.Pointer + Offset));
        }

        public JumpInstruction(Machine machine, int offset)
        {
            Machine = machine;
            Offset = offset;
        }

        public override string ToString()
        {
            return $"{Mnemonic} {Offset}";
        }

    }

    public class JumpEvenInstruction : JumpInstruction
    {
        public override string Mnemonic { get { return "jie"; } }
        public override char Register { get; protected set; }

        public override void Execute()
        {
            var regValue = Machine.Registers[Register].Value;
            if (regValue % 2 == 0)
                Machine.SetPointer((uint)(Machine.Pointer + Offset));
        }

        public JumpEvenInstruction(Machine machine, char register, int offset) : base(machine, offset)
        {
            Register = register;
        }

        public override string ToString()
        {
            return $"{Mnemonic} {Register}, {Offset}";
        }

    }

    public class JumpOneInstruction : JumpInstruction
    {
        public override string Mnemonic { get { return "jio"; } }
        public override char Register { get; protected set; }

        public override void Execute()
        {
            var regValue = Machine.Registers[Register].Value;
            if (regValue == 1)
                Machine.SetPointer((uint)(Machine.Pointer + Offset));
        }

        public JumpOneInstruction(Machine machine, char register, int offset) : base(machine, offset)
        {
            Register = register;
        }

        public override string ToString()
        {
            return $"{Mnemonic} {Register}, {Offset}";
        }

    }
    #endregion instructions



    public class Machine
    {
        public uint Pointer { get; private set; }
        public Dictionary<char, Register> Registers { get; private set; }

        private bool jumpFlag = false;

        internal void SetPointer(uint value)
        {
            Pointer = value;
            jumpFlag = true;
        }

        internal void Execute(Program program)
        {
            while (Pointer < program.Instructions.Count)
            {
                jumpFlag = false;
                var currentInstruction = program.Instructions[(int)Pointer];
                currentInstruction.Execute();
                if (!jumpFlag)
                    Pointer++;
                //PrintState(currentInstruction);
            }
        }

        private void PrintState(IInstruction instruction)
        {
            Console.WriteLine($"Executed instruction {instruction}");
            Console.WriteLine($"Program pointer = {Pointer}");
            foreach (var register in Registers.Values)
            {
                Console.WriteLine($"  {register.Name} = {register.Value}");
            }
            Console.ReadLine();
        }

        public Machine(params char[] registers)
        {
            Registers = registers.Select(regName => new Register { Name = regName, Value = 0 }).ToDictionary(r => r.Name);
            Pointer = 0;
        }
    }

    public class Program
    {
        public List<IInstruction> Instructions { get; private set; }

        internal static Program LoadFromFile(Dictionary<string, Func<char, int, IInstruction>> instructionDictionary, string sourceFile)
        {
            var result = new Program { Instructions = new List<IInstruction>() };
            var lines = File.ReadAllLines(sourceFile);
            Regex[] regexes = {
                new Regex(@"^([a-z]{3}) ([a-z]), ((\+|-)\d*)$", RegexOptions.Compiled),
                new Regex(@"^([a-z]{3}) ([a-z])$", RegexOptions.Compiled),
                new Regex(@"^([a-z]{3}) ((\+|-)\d*)$", RegexOptions.Compiled)
            };
            foreach (var line in lines)
            {
                var match = regexes.Single(r => r.IsMatch(line)).Match(line);
                var mnemonic = match.Groups[1].Value;

                char register = '_';
                int offset = 0;
                if (match.Groups[2].Value.Length == 1)
                {
                    register = match.Groups[2].Value[0];
                    if (match.Groups.Count >= 4)
                        offset = int.Parse(match.Groups[3].Value);
                }
                else
                    offset = int.Parse(match.Groups[2].Value);

                result.Instructions.Add(instructionDictionary[mnemonic](register, offset));
            }
            return result;
        }
    }

    public class Register
    {
        public char Name { get; set; }
        public uint Value { get; set; }
    }
}

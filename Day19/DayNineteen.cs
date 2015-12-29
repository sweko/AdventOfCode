using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdventOfCode.Day19
{
    class DayNineteen
    {
        internal static int CalculateMolecules()
        {
            var input = LoadInput();
            var result = GetDescendants(input.Rules, input.Molecule);
            return result.Count;
        }

        internal static int GenerateMolecule()
        {
            var input = LoadInput();
            var generation = new HashSet<string> { "e" };
            var number = 0;

            while (!generation.Contains(input.Molecule))
            {
                generation = NextGeneration(input.Rules, generation);
                number++;

                PrintGeneration(number, generation);
            }

            return number;
        }

        internal static int DecomposeMolecule()
        {
            var input = LoadInput();
            var rules = InvertRules(input.Rules);
            var molecule = input.Molecule;
            var parens = GetParenthesisExpressions(molecule);
            var iterations = 0;
            while (parens.Count != 0)
            {
                var parenReplacements = parens
                    .Select(p => new { Original = p.Item1, Index = p.Item2, Replacement = DecomposeMoleculePart(p.Item1, rules) })
                    .OrderByDescending(p => p.Index)
                    .ToList();

                foreach (var item in parenReplacements)
                {
                    molecule = molecule.Remove(item.Index, item.Original.Length).Insert(item.Index, item.Replacement.Item1);
                    iterations += item.Replacement.Item2;
                }
                parens = GetParenthesisExpressions(molecule);
                Console.WriteLine(molecule);
                Console.WriteLine(molecule.Length);
            }

            var target = "E";
            while (molecule != target)
            {
                var rule = GetNextRule(molecule, rules);
                molecule = ApplyRule(molecule, rule.Item1, rules[rule.Item1], rule.Item2);
                iterations++;
            }

            return iterations;
        }

        private static Tuple<string, int> DecomposeMoleculePart(string molecule, Dictionary<string, string> rules)
        {
            var current = new HashSet<string> { molecule };
            var iterations = 0;
            while (!current.Any(m => m.Length == 1))
            {
                current = GetPreviousStates(current, rules);
                iterations++;
            }
            return Tuple.Create(current.First(m => m.Length == 1), iterations);
        }

        private static List<Tuple<string,int>> GetParenthesisExpressions(string molecule)
        {
            var result = new List<Tuple<string, int>>();
            var regex = new Regex(@"[A-Z]\(", RegexOptions.Compiled);
            var matches = regex.Matches(molecule);
            var prevEnd = -1;
            foreach (Match match in matches)
            {
                var start = match.Index;
                if (start < prevEnd)
                    continue;
                var end = molecule.IndexOf(')', start);
                var paren = molecule.Substring(start, end - start + 1);
                while (paren.Count(c => c == '(') != paren.Count(c => c == ')'))
                {
                    end = molecule.IndexOf(')', end + 1);
                    paren = molecule.Substring(start, end - start + 1);
                }
                prevEnd = end;
                result.Add(Tuple.Create(paren, start));
            }
            return result;
        }

        private static HashSet<string> GetPreviousStates(HashSet<string> current, Dictionary<string, string> rules)
        {
            var result = new HashSet<string>();
            foreach (var molecule in current)
            {
                result.UnionWith(GetPreviousStates(molecule, rules));
            }
            return result;
        }

        private static HashSet<string> GetPreviousStates(string molecule, Dictionary<string, string> rules)
        {
            var result = new HashSet<string>();
            var applicableRules = rules.Where(r => molecule.Contains(r.Key));

            foreach (var rule in applicableRules)
            {
                int index = 0;
                do
                {
                    index = molecule.IndexOf(rule.Key, index);
                    if (index != -1)
                    {
                        result.Add(ApplyRule(molecule, rule.Key, rule.Value, index));
                        index++;
                    }
                } while (index != -1);
            }
            return result;
        }

        internal static int CalculateDecomposition()
        {
            var input = LoadInput();
            var total = input.Molecule.Length;
            var parens = input.Molecule.Count(c => c == '(');
            var ypsilons = input.Molecule.Count(c => c == 'Y');
            var result = total - 2 * parens - 2 * ypsilons - 1;
            return result;
        }

        private static string ApplyRule(string molecule, string rule, string value, int pos)
        {
            return molecule.Remove(pos, rule.Length).Insert(pos, value);
        }

        private static Tuple<string, int> GetNextRule(string molecule, Dictionary<string, string> rules)
        {
            //priority:
            //1. parentheses rule
            var parRules = rules.Where(r => r.Key.Contains('('));
            foreach (var rule in parRules)
            {
                if (molecule.Contains(rule.Key))
                {
                    return Tuple.Create(rule.Key, molecule.IndexOf(rule.Key));
                }
            }

            //2. rules that could apply within parenteses
            var regex = new Regex(@"\((.*)\)");
            var matches = regex.Matches(molecule).Cast<Match>().Select(m => new
            {
                Value = m.Groups[1].Value,
                Index = m.Groups[1].Index,
            });

            foreach (var match in matches)
            {
                var result = GetUnboundRule(match.Value, rules);
                if (!string.IsNullOrEmpty(result.Item1))
                    return Tuple.Create(result.Item1, result.Item2 + match.Index);
            }

            //3. everything else
            return GetUnboundRule(molecule, rules);
        }

        private static Tuple<string, int> GetUnboundRule(string molecule, Dictionary<string, string> rules)
        {
            //match as close as possible to the end
            var index = molecule.Length - 2;
            var size = 2;
            while (true)
            {
                var cut = molecule.Substring(index, size);
                if (rules.ContainsKey(cut))
                {
                    //exact match
                    return Tuple.Create(cut, index);
                }
                if (rules.Keys.Any(r => r.EndsWith(cut)))
                {
                    //grow backwards
                    index--;
                    size++;
                }
                else
                {
                    index--;
                    size = 2;

                    if (index == -1)
                        return Tuple.Create(string.Empty, 0);
                }
            }
        }

        private static Dictionary<string, string> InvertRules(Dictionary<string, List<string>> rules)
        {
            var result = new Dictionary<string, string>();
            foreach (var item in rules)
            {
                foreach (var value in item.Value)
                {
                    result.Add(value, item.Key);
                }
            }
            return result;
        }

        private static void PrintGeneration(int number, HashSet<string> generation)
        {
            Console.WriteLine($"Generation #{number} - {generation.Count} items");
            //foreach (var item in generation)
            //{
            //    Console.WriteLine($"  {item}");
            //}
        }

        private static HashSet<string> NextGeneration(Dictionary<string, List<string>> rules, HashSet<string> generation)
        {
            var result = new HashSet<string>();
            foreach (var ancestor in generation)
            {
                var descendants = GetDescendants(rules, ancestor);
                result.UnionWith(descendants);
            }
            return result;
        }

        private static HashSet<string> GetDescendants(Dictionary<string, List<string>> rules, string ancestor)
        {
            var result = new HashSet<string>();
            var index = 0;
            while (index < ancestor.Length)
            {
                var element = ancestor[index].ToString();

                if (rules.ContainsKey(element))
                {
                    var before = index > 0 ? ancestor.Substring(0, index) : string.Empty;
                    var after = ancestor.Substring(index + 1, ancestor.Length - index - 1);

                    foreach (var subst in rules[element].Select(r => before + r + after))
                    {
                        result.Add(subst);
                    };
                }

                index += element.Length;
            }
            return result;
        }

        private static MoleculeRules LoadInput()
        {
            //test case
            /*
            var molecule = "HOHOHO";
            var rules = new Dictionary<string, List<string>>
            {
                {"e", new List<string> { "H", "O"}},
                {"H", new List<string> { "HO", "OH"}},
                {"O", new List<string> { "HH"}},
            };
            */

            //var molecule = "ORnPBPMgArCaCaCaSiThCaCaSiThCaCaPBSiRnFArRnFArCaCaSiThCaCaSiThCaCaCaCaCaCaSiRnFYFArSiRnMgArCaSiRnPTiTiBFYPBFArSiRnCaSiRnTiRnFArSiAlArPTiBPTiRnCaSiAlArCaPTiTiBPMgYFArPTiRnFArSiRnCaCaFArRnCaFArCaSiRnSiRnMgArFYCaSiRnMgArCaCaSiThPRnFArPBCaSiRnMgArCaCaSiThCaSiRnTiMgArFArSiThSiThCaCaSiRnMgArCaCaSiRnFArTiBPTiRnCaSiAlArCaPTiRnFArPBPBCaCaSiThCaPBSiThPRnFArSiThCaSiThCaSiThCaPTiBSiRnFYFArCaCaPRnFArPBCaCaPBSiRnTiRnFArCaPRnFArSiRnCaCaCaSiThCaRnCaFArYCaSiRnFArBCaCaCaSiThFArPBFArCaSiRnFArRnCaCaCaFArSiRnFArTiRnPMgArF";
            var molecule = "O(PBPM)DDDSGDDSGDDPBS(F)(F)DDSGDDSGDDDDDDS(FYF)S(M)DS(PTTBFYPBF)S(DS(T(F)SA)PTBPT(DSA)DPTTBPMYF)PT(F)S(DDF)(DF)DS(S(M)FYDS(M)DDSGP(F)PBDS(M)DDSGDS(TM)F)SGSGDDS(M)DDS(F)TBPT(DSA)DPT(F)PBPBDDSGDPBSGP(F)SGDSGDSGDPTBS(FYF)DDP(F)PBDDPBS(T(F)DP(F)S(DDDSGD(DF)YDS(F)BDDDSGF)PBF)DS(F)(DDDF)S(F)T(PM)F";
            var rules = new Dictionary<string, List<string>>();
            var lines = File.ReadAllLines(@"Day19\inputMod.txt");
            var regex = new Regex(@"^(\w*) => ([A-Z()]*)$", RegexOptions.Compiled);

            foreach (var line in lines)
            {
                var match = regex.Match(line);
                var from = match.Groups[1].Value;
                var to = match.Groups[2].Value;
                if (rules.ContainsKey(from))
                    rules[from].Add(to);
                else
                    rules.Add(from, new List<string> { to });
            }

            return new MoleculeRules
            {
                Molecule = molecule,
                Rules = rules
            };
        }

        private class MoleculeRules
        {
            public string Molecule { get; set; }
            public Dictionary<string, List<string>> Rules { get; set; }
        }
    }
}

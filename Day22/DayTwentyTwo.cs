using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day22
{
    class DayTwentyTwo
    {
        private static List<Spell> spells;
        private static Dictionary<string, Spell> spellsDict;

        public static int Simulate()
        {
            Init();
            //var sx = new List<Spell> { spellsDict["Shield"], spellsDict["Recharge"], spellsDict["Poison"], spellsDict["Magic Missile"], spellsDict["Shield"], spellsDict["Recharge"], spellsDict["Poison"], spellsDict["Magic Missile"], spellsDict["Magic Missile"], spellsDict["Magic Missile"] };
            //var r = ExecuteSpellPath(sx);
            //return r;

            var spellPaths = new List<List<Spell>> { new List<Spell>() };
            var generation = 0;
            var bestPathValue = int.MaxValue;
            while (spellPaths.Count != 0)
            {
                generation++;
                spellPaths = GetNextPaths(spellPaths);
                Console.WriteLine($"Generation #{generation}: total {spellPaths.Count} possible spell paths");
                var donePaths = new List<int>();
                var index = 0;
                foreach (var spellPath in spellPaths)
                {
                    var result = ExecuteSpellPath(spellPath);
                    if (result > 0)
                    {
                        Console.WriteLine($"{result}: {string.Join(", ", spellPath.Select(s => s.Name))}");
                        donePaths.Add(index);
                        if (result < bestPathValue)
                            bestPathValue = result;
                    }
                    if (result < 0)
                    {
                        donePaths.Add(index);
                    }
                    index++;
                    if (index % 13 == 0)
                    {
                        Console.WriteLine($"Processed {index}/{spellPaths.Count} paths. Eliminated {donePaths.Count} so far");
                        Console.CursorTop--;
                    }
                }
                //Console.WriteLine(new string(' ', Console.WindowWidth));
                //Console.CursorTop--;
                //Console.WriteLine($"Removing Eliminated paths....");
                //Console.CursorTop--;
                donePaths.Reverse();
                foreach (var item in donePaths)
                {
                    spellPaths.RemoveAt(item);
                }
                //spellPaths.RemoveAll(sp => donePaths.Contains(sp));
                Console.WriteLine($"Generation #{generation}: total {donePaths.Count} non-viable spell paths eliminated ");
                Console.WriteLine($"Generation #{generation}: total {spellPaths.Count} viable spell paths found ");
                Console.WriteLine();
            }
            return bestPathValue;
        }

        private static int ExecuteSpellPath(List<Spell> spellPath)
        {
            var wizard = new Fighter
            {
                Health = 50,
                Mana = 500,
                Armor = 0,
                Damage = 0

            };
            var boss = new Fighter
            {
                Health = 51,
                Mana = 0,
                Armor = 0,
                Damage = 9
            };
            var battle = new Battle(wizard, boss);
            //battle.Debug = true;
            foreach (var spell in spellPath)
            {
                var result = battle.NextTurn(spell);
                if (!result)
                    return -1;
                if (battle.Boss.Health <= 0)
                    return battle.ManaSpent;
            }
            return 0;
        }

        private static List<List<Spell>> GetNextPaths(List<List<Spell>> spellPaths)
        {
            var result = new List<List<Spell>>();
            var combinations = from sp in spellPaths
                               from s in spells
                               select new { SpellPath = sp, Spell = s };

            foreach (var item in combinations)
            {
                var spellPath = new List<Spell>(item.SpellPath);
                spellPath.Add(item.Spell);
                result.Add(spellPath);
            }
            return result;
        }

        private static void Init()
        {
            spells = new List<Spell>
            {
                new Spell
                {
                    Name = "Magic Missile",
                    Cost = 53,
                    Action = (spell, wizard, boss) => {
                        boss.Health -=4;
                    },
                    Duration = 1,
                    Type = EffectType.Immediate
                },
                new Spell
                {
                    Name = "Drain",
                    Cost = 73,
                    Action = (spell, wizard, boss) => {
                        boss.Health -=2;
                        wizard.Health +=2;
                    },
                    Duration = 1,
                    Type = EffectType.Immediate
                },
                new Spell
                {
                    Name = "Shield",
                    Cost = 113,
                    Action = (spell, wizard, boss) => {
                        wizard.Armor = 7;
                        if (spell.Duration == 0)
                        {
                            wizard.Armor = 0;
                        }
                    },
                    Duration = 6,
                    Type = EffectType.BeginTurn
                },
                new Spell
                {
                    Name = "Poison",
                    Cost = 173,
                    Action = (spell, wizard, boss) => {
                        boss.Health -=3;
                    },
                    Duration = 6,
                    Type = EffectType.BeginTurn
                },
                new Spell
                {
                    Name = "Recharge",
                    Cost = 229,
                    Action = (spell, wizard, boss) => {
                        wizard.Mana +=101;
                    },
                    Duration = 5,
                    Type = EffectType.BeginTurn
                }
            };

            spellsDict = new Dictionary<string, Spell>
            {
                { "Magic Missile", spells[0]},
                { "Drain", spells[1]},
                { "Shield", spells[2]},
                { "Poison", spells[3]},
                { "Recharge", spells[4]}
            };
        }

        private class Spell
        {
            public string Name { get; set; }
            public int Cost { get; set; }
            public Action<ActiveSpell, Fighter, Fighter> Action { get; set; }
            public int Duration { get; set; }
            public EffectType Type { get; set; }

            public ActiveSpell Cast()
            {
                return new ActiveSpell
                {
                    Spell = this,
                    Duration = this.Duration
                };
            }
        }

        private enum EffectType
        {
            Immediate,
            BeginTurn
        }

        private class ActiveSpell
        {
            public Spell Spell { get; set; }
            public int Duration { get; set; }
        }

        private class Fighter
        {
            public int Armor { get; internal set; }
            public int Damage { get; internal set; }
            public int Health { get; internal set; }
            public int Mana { get; internal set; }
        }

        private class Battle
        {
            public Fighter Boss { get; private set; }
            public Fighter Wizard { get; private set; }
            public List<ActiveSpell> ActiveSpells { get; set; }
            public int ManaSpent { get; set; }
            public bool Debug { get; internal set; }

            public Battle(Fighter wizard, Fighter boss)
            {
                Wizard = wizard;
                Boss = boss;
                ActiveSpells = new List<ActiveSpell>();
            }

            internal bool NextTurn(Spell spell)
            {
                if (ActiveSpells.Any(a => a.Spell.Name == spell.Name))
                {
                    if (Debug)
                        Console.WriteLine("Cannot cast active spell");
                    return false;
                }

                if (spell.Cost > Wizard.Mana)
                {
                    if (Debug)
                        Console.WriteLine("Wizard is out of mana");
                    return false;
                }

                //player turn
                BeginTurn(true);
                if (Wizard.Health <= 0)
                    return false;
                if (Boss.Health <=0)
                    return true;
                Wizard.Mana -= spell.Cost;
                ManaSpent += spell.Cost;
                ActiveSpells.Add(spell.Cast());
                if (Debug)
                    Console.WriteLine($"  Casting {spell.Name} for {spell.Duration} duration"); ;
                InTurn(true);
                if (Wizard.Health <= 0)
                    return false;
                if (Boss.Health <= 0)
                    return true;
                EndTurn(true);
                if (Wizard.Health <= 0)
                    return false;
                if (Boss.Health <= 0)
                    return true;

                //boss turn
                BeginTurn(false);
                if (Wizard.Health <= 0)
                    return false;
                if (Boss.Health <= 0)
                    return true;
                Wizard.Health -= Boss.Damage - Wizard.Armor;
                InTurn(false);
                if (Wizard.Health <= 0)
                    return false;
                if (Boss.Health <= 0)
                    return true;
                EndTurn(false);
                if (Wizard.Health <= 0)
                    return false;
                return true;
            }

            private void EndTurn(bool isPlayer)
            {
                if (Debug)
                {
                    var player = isPlayer ? "Wizard" : "Boss";
                    Console.WriteLine($"Ending turn for {player}");
                    Console.WriteLine($"  Wizard has {Wizard.Health} hit points and {Wizard.Mana} mana");
                    Console.WriteLine($"  Boss hass {Boss.Health} hit points");
                    Console.WriteLine();
                }
            }

            private void InTurn(bool isPlayer)
            {
                if (Debug)
                {
                    var player = isPlayer ? "Wizard" : "Boss";
                    Console.WriteLine($"Inside turn for {player}");

                    if (!isPlayer)
                    {
                        Console.WriteLine($"  Boss hits Wizard for {Boss.Damage - Wizard.Armor} damage");
                    }

                }
                for (int i = ActiveSpells.Count - 1; i >= 0; i--)
                {
                    var current = ActiveSpells[i];
                    if (current.Spell.Type != EffectType.Immediate)
                        continue;
                    current.Duration--;
                    current.Spell.Action(current, Wizard, Boss);
                    if (Debug)
                        Console.WriteLine($"  Efecting {current.Spell.Name}"); ;

                    if (current.Duration == 0)
                    {
                        ActiveSpells.Remove(current);
                    }
                }
            }

            private void BeginTurn(bool isPlayer)
            {
                if (Debug)
                {
                    var player = isPlayer ? "Wizard" : "Boss";
                    Console.WriteLine($"Beginning turn for {player}");
                }
                for (int i = ActiveSpells.Count - 1; i >= 0; i--)
                {
                    var current = ActiveSpells[i];
                    if (current.Spell.Type != EffectType.BeginTurn)
                        continue;
                    if (Debug)
                    {
                        Console.WriteLine($"  {current.Spell.Name} is active");
                    }
                    current.Duration--;
                    current.Spell.Action(current, Wizard, Boss);
                    if (Debug)
                        Console.WriteLine($"  {current.Spell.Name} has {current.Duration} duration left ");
                    if (current.Duration == 0)
                    {
                        if (Debug)
                            Console.WriteLine($"  {current.Spell.Name} effect has ended");
                        ActiveSpells.Remove(current);
                    }
                }
                //part 2:
                if (isPlayer)
                {
                    if (Debug)
                        Console.WriteLine($"  Wizard bleeds for 1 damage");
                    Wizard.Health--;
                }
            }
        }
    }
}

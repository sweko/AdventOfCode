using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day21
{
    public class DayTwentyOne
    {
        public static int SimulateLoss()
        {
            var weapons = new List<Item> {
                new Item {Name = "Dagger", Price = 8, Damage = 4},
                new Item {Name = "Shortsword", Price = 10, Damage = 5},
                new Item {Name = "Warhammer", Price = 25, Damage = 6},
                new Item {Name = "Longsword", Price = 40, Damage = 7},
                new Item {Name = "Greataxe", Price = 74, Damage = 8}
            };

            var armors = new List<Item>
            {
                new Item {Name = "Gologuz" },
                new Item {Name="Leather", Price = 13, Armor = 1 },
                new Item {Name="Chainmail", Price = 31, Armor = 2 },
                new Item {Name="Splintmail", Price = 53, Armor = 3 },
                new Item {Name="Bandedmail", Price = 75, Armor = 4 },
                new Item {Name="Platemail", Price = 102, Armor = 5 }
            };

            var rings = new List<Item>
            {
                new Item {Name="Nothing" },
                new Item {Name="Damage+1", Price = 25, Damage = 1 },
                new Item {Name="Damage+2", Price = 50, Damage = 2 },
                new Item {Name="Damage+3", Price = 100, Damage = 3 },
                new Item {Name="Armor+1", Price = 20, Armor = 1 },
                new Item {Name="Armor+2", Price = 40, Armor = 2 },
                new Item {Name="Armor+3", Price = 80, Armor = 3 }
            };
            var maxPrice = int.MinValue;
            foreach (var weapon in weapons)
            {
                foreach (var armor in armors)
                {
                    foreach (var leftRing in rings)
                    {
                        foreach (var rightRing in rings)
                        {
                            if (leftRing == rightRing)
                                continue;

                            var damage = weapon.Damage + leftRing.Damage + rightRing.Damage;
                            var defense = armor.Armor + leftRing.Armor + rightRing.Armor;
                            var victory = BossFight(damage, defense);
                            if (!victory)
                            {
                                var value = weapon.Price + armor.Price + leftRing.Price + rightRing.Price;
                                if (value > maxPrice)
                                {
                                    maxPrice = value;
                                    var desc = $"Boss battle wielding {weapon.Name}, shielding {armor.Name}, wearing {leftRing.Name} and {rightRing.Name} finished in";
                                    Console.WriteLine($"{desc} defeat with a price of {value} gold");
                                }
                            }
                        }
                    }
                }
            }

            return maxPrice;
        }

        public static int SimulateVictory()
        {
            var weapons = new List<Item> {
                new Item {Name = "Dagger", Price = 8, Damage = 4},
                new Item {Name = "Shortsword", Price = 10, Damage = 5},
                new Item {Name = "Warhammer", Price = 25, Damage = 6},
                new Item {Name = "Longsword", Price = 40, Damage = 7},
                new Item {Name = "Greataxe", Price = 74, Damage = 8}
            };

            var armors = new List<Item>
            {
                new Item {Name = "Gologuz" },
                new Item {Name="Leather", Price = 13, Armor = 1 },
                new Item {Name="Chainmail", Price = 31, Armor = 2 },
                new Item {Name="Splintmail", Price = 53, Armor = 3 },
                new Item {Name="Bandedmail", Price = 75, Armor = 4 },
                new Item {Name="Platemail", Price = 102, Armor = 5 }
            };

            var rings = new List<Item>
            {
                new Item {Name="Nothing" },
                new Item {Name="Damage+1", Price = 25, Damage = 1 },
                new Item {Name="Damage+2", Price = 50, Damage = 2 },
                new Item {Name="Damage+3", Price = 100, Damage = 3 },
                new Item {Name="Armor+1", Price = 20, Armor = 1 },
                new Item {Name="Armor+2", Price = 40, Armor = 2 },
                new Item {Name="Armor+3", Price = 80, Armor = 3 }
            };
            var minPrice = int.MaxValue;
            foreach (var weapon in weapons)
            {
                foreach (var armor in armors)
                {
                    foreach (var leftRing in rings)
                    {
                        foreach (var rightRing in rings)
                        {
                            if (leftRing == rightRing)
                                continue;

                            var damage = weapon.Damage + leftRing.Damage + rightRing.Damage;
                            var defense = armor.Armor + leftRing.Armor + rightRing.Armor;
                            var victory = BossFight(damage, defense);
                            if (victory)
                            {
                                var value = weapon.Price + armor.Price + leftRing.Price + rightRing.Price;
                                if (value < minPrice)
                                {
                                    minPrice = value;
                                    var desc = $"Boss battle wielding {weapon.Name}, shielding {armor.Name}, wearing {leftRing.Name} and {rightRing.Name} finished in";
                                    Console.WriteLine($"{desc} victory with a price of {value} gold");
                                }
                            }
                        }
                    }
                }
            }

            return minPrice;
        }

        public static bool BossFight(int damage, int armor)
        {
            var you = new Fighter { Name = "Player", HitPoints = 100, Damage = damage, Armor = armor };
            var boss = new Fighter { Name = "Boss", HitPoints = 104, Damage = 8, Armor = 1 };
            return Fight(you, boss);
        }

        public static bool Fight(Fighter first, Fighter second)
        {
            var firstTurn = true;
            while ((first.HitPoints) > 0 && (second.HitPoints > 0))
            {
                if (firstTurn)
                {
                    var damage = Math.Max(first.Damage - second.Armor, 1);
                    second.HitPoints -= damage;
                }
                else
                {
                    var damage = Math.Max(second.Damage - first.Armor, 1);
                    first.HitPoints -= damage;
                }
                firstTurn = !firstTurn;
                //Console.WriteLine(first);
                //Console.WriteLine(second);
            }
            return (first.HitPoints > 0);
        }

        public class Fighter
        {
            public string Name { get; set; }
            public int HitPoints { get; set; }
            public int Damage { get; set; }
            public int Armor { get; set; }

            public override string ToString()
            {
                return $"{Name} has {HitPoints} hit points (doing {Damage} damage and armored for {Armor})";
            }
        }

        public class Item
        {
            public string Name { get; set; }
            public int Price { get; set; }
            public int Damage { get; set; }
            public int Armor { get; set; }
        }
    }
}

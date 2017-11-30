using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day15
{
    public class DayFifteen
    {
        private static Ingredient frosting;
        private static Ingredient candy;
        private static Ingredient butterscotch;
        private static Ingredient sugar;

        private static void Load()
        {
            frosting = new Ingredient
            {
                Name = "Frosting",
                Capacity = 4,
                Durability = -2,
                Flavor = 0,
                Texture = 0,
                Calories = 5
            };
            candy = new Ingredient
            {
                Name = "Candy",
                Capacity = 0,
                Durability = 5,
                Flavor = -1,
                Texture = 0,
                Calories = 8
            };
            butterscotch = new Ingredient
            {
                Name = "Butterscotch",
                Capacity = -1,
                Durability = 0,
                Flavor = 5,
                Texture = 0,
                Calories = 6
            };
            sugar = new Ingredient
            {
                Name = "Sugar",
                Capacity = 0,
                Durability = 0,
                Flavor = -2,
                Texture = 2,
                Calories = 1
            };
        }

        public static long MixCookies()
        {
            Load();
            var highScore = long.MinValue;
            for (int i = 0; i <= 100; i++)
            {
                for (int j = 0; j <= 100 - i; j++)
                {
                    for (int k = 0; k <= 100 - i - j; k++)
                    {
                        for (int l = 0; l <= 100 - i - j - k; l++)
                        {
                            var capacity = i * frosting.Capacity + j * candy.Capacity + k * butterscotch.Capacity + l * sugar.Capacity;
                            if (capacity < 0)
                                capacity = 0;
                            var durability = i * frosting.Durability + j * candy.Durability + k * butterscotch.Durability + l * sugar.Durability;
                            if (durability < 0)
                                durability = 0;
                            var flavor = i * frosting.Flavor + j * candy.Flavor + k * butterscotch.Flavor + l * sugar.Flavor;
                            if (flavor < 0)
                                flavor = 0;
                            var texture = i * frosting.Texture + j * candy.Texture + k * butterscotch.Texture + l * sugar.Texture;
                            if (texture < 0)
                                texture = 0;

                            var score = capacity * durability * flavor * texture;
                            if (score > highScore)
                                highScore = score;
                        }
                    }
                }
            }
            return highScore;
        }

        internal static object MixCookies500()
        {
            Load();
            var targetCalories = 500;
            var highScore = long.MinValue;
            for (int i = 0; i <= 100; i++)
            {
                for (int j = 0; j <= 100 - i; j++)
                {
                    for (int k = 0; k <= 100 - i - j; k++)
                    {
                        for (int l = 0; l <= 100 - i - j - k; l++)
                        {
                            var calories = i * frosting.Calories + j * candy.Calories + k * butterscotch.Calories + l * sugar.Calories;
                            if (calories != targetCalories)
                                continue;

                            var capacity = i * frosting.Capacity + j * candy.Capacity + k * butterscotch.Capacity + l * sugar.Capacity;
                            if (capacity < 0)
                                capacity = 0;
                            var durability = i * frosting.Durability + j * candy.Durability + k * butterscotch.Durability + l * sugar.Durability;
                            if (durability < 0)
                                durability = 0;
                            var flavor = i * frosting.Flavor + j * candy.Flavor + k * butterscotch.Flavor + l * sugar.Flavor;
                            if (flavor < 0)
                                flavor = 0;
                            var texture = i * frosting.Texture + j * candy.Texture + k * butterscotch.Texture + l * sugar.Texture;
                            if (texture < 0)
                                texture = 0;

                            var score = capacity * durability * flavor * texture;
                            if (score > highScore)
                                highScore = score;
                        }
                    }
                }
            }
            return highScore;
        }

        private class Ingredient
        {
            public string Name { get; set; }
            public long Capacity { get; set; }
            public long Durability { get; set; }
            public long Flavor { get; set; }
            public long Texture { get; set; }
            public long Calories { get; set; }
        }
    }
}

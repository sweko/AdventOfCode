using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventOfCode.Day15
{
    public class DayFifteen
    {
        private static Ingredient sugar;
        private static Ingredient sprinkles;
        private static Ingredient candy;
        private static Ingredient chocolate;

        private static void Load()
        {
            sugar = new Ingredient
            {
                Name = "Sugar",
                Capacity = 3,
                Durability = 0,
                Flavor = 0,
                Texture = -3,
                Calories = 2
            };
            sprinkles = new Ingredient
            {
                Name = "Sprinkles",
                Capacity = -3,
                Durability = 3,
                Flavor = 0,
                Texture = 0,
                Calories = 9
            };
            candy = new Ingredient
            {
                Name = "Candy",
                Capacity = -1,
                Durability = 0,
                Flavor = 4,
                Texture = 0,
                Calories = 1
            };
            chocolate = new Ingredient
            {
                Name = "Chocolate",
                Capacity = 0,
                Durability = 0,
                Flavor = -2,
                Texture = 2,
                Calories = 8
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
                            var capacity = i * sugar.Capacity + j * sprinkles.Capacity + k * candy.Capacity + l * chocolate.Capacity;
                            if (capacity < 0)
                                capacity = 0;
                            var durability = i * sugar.Durability + j * sprinkles.Durability + k * candy.Durability + l * chocolate.Durability;
                            if (durability < 0)
                                durability = 0;
                            var flavor = i * sugar.Flavor + j * sprinkles.Flavor + k * candy.Flavor + l * chocolate.Flavor;
                            if (flavor < 0)
                                flavor = 0;
                            var texture = i * sugar.Texture + j * sprinkles.Texture + k * candy.Texture + l * chocolate.Texture;
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
                            var calories = i * sugar.Calories + j * sprinkles.Calories + k * candy.Calories + l * chocolate.Calories;
                            if (calories != targetCalories)
                                continue;

                            var capacity = i * sugar.Capacity + j * sprinkles.Capacity + k * candy.Capacity + l * chocolate.Capacity;
                            if (capacity < 0)
                                capacity = 0;
                            var durability = i * sugar.Durability + j * sprinkles.Durability + k * candy.Durability + l * chocolate.Durability;
                            if (durability < 0)
                                durability = 0;
                            var flavor = i * sugar.Flavor + j * sprinkles.Flavor + k * candy.Flavor + l * chocolate.Flavor;
                            if (flavor < 0)
                                flavor = 0;
                            var texture = i * sugar.Texture + j * sprinkles.Texture + k * candy.Texture + l * chocolate.Texture;
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

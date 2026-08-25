import dotenv from "dotenv";
dotenv.config();

import { sequelize, User, Cuisine, Recipe } from "./server/models/index.js";

const seedAllCuisines = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    const admin = await User.findOne({ where: { email: "sarah@chulha.app" } });
    if (!admin) return;

    const cuisines = await Cuisine.findAll();
    const cuisineMap = {};
    for (const c of cuisines) {
      cuisineMap[c.slug] = c;
    }

    const newRecipes = [
      {
        slug: "italian-spaghetti-carbonara",
        title: "Classic Spaghetti Carbonara",
        image: "/assets/italian_pasta.jpg",
        creatorId: admin.id,
        cuisineId: cuisineMap["italian"]?.id,
        cuisineName: "Italian",
        flag: "🇮🇹",
        minutes: 25,
        difficulty: "Medium",
        category: "Dinner",
        beginner: false,
        rating: 4.8,
        description: "A classic Roman pasta dish made with eggs, hard cheese, cured pork, and black pepper.",
        ingredients: ["Spaghetti", "Guanciale or Pancetta", "Parmesan Cheese", "Eggs", "Black Pepper"],
        steps: ["Boil pasta.", "Fry pancetta until crispy.", "Whisk eggs and cheese.", "Toss pasta with pancetta.", "Off heat, mix in egg mixture quickly.", "Garnish with pepper and cheese."],
        tip: "Never add the egg mixture while the pan is on the heat, or you'll get scrambled eggs!",
        status: "Approved"
      },
      {
        slug: "chinese-dim-sum-dumplings",
        title: "Steamed Shrimp Dumplings",
        image: "/assets/chinese_dumplings.jpg",
        creatorId: admin.id,
        cuisineId: cuisineMap["chinese"]?.id,
        cuisineName: "Chinese",
        flag: "🇨🇳",
        minutes: 45,
        difficulty: "Hard",
        category: "Lunch",
        beginner: false,
        rating: 4.9,
        description: "Delicate and juicy Chinese steamed dumplings (Har Gow) served in a bamboo steamer.",
        ingredients: ["Dumpling Wrappers", "Minced Shrimp", "Ginger", "Scallions", "Soy Sauce", "Sesame Oil"],
        steps: ["Mix shrimp with ginger, scallions, soy sauce, and sesame oil.", "Place a spoonful of filling on each wrapper.", "Fold and pleat the edges to seal.", "Steam in a bamboo steamer for 8-10 minutes.", "Serve hot with chili oil soy sauce."],
        tip: "Line the steamer with cabbage leaves to prevent sticking.",
        status: "Approved"
      },
      {
        slug: "japanese-sushi-platter",
        title: "Premium Sushi Platter",
        image: "/assets/japanese_sushi.jpg",
        creatorId: admin.id,
        cuisineId: cuisineMap["japanese"]?.id,
        cuisineName: "Japanese",
        flag: "🇯🇵",
        minutes: 60,
        difficulty: "Hard",
        category: "Dinner",
        beginner: false,
        rating: 5.0,
        description: "An elegant assortment of fresh Nigiri, Maki rolls, and Sashimi beautifully presented on a slate board.",
        ingredients: ["Sushi Rice", "Sashimi-grade Salmon", "Sashimi-grade Tuna", "Nori Sheets", "Wasabi", "Pickled Ginger"],
        steps: ["Prepare and season sushi rice.", "Slice fish into thin pieces.", "Shape rice blocks for Nigiri and top with fish.", "Roll rice, fish, and vegetables in Nori for Maki.", "Arrange beautifully on a platter with ginger and wasabi."],
        tip: "Wet your hands before handling sushi rice to prevent sticking.",
        status: "Approved"
      },
      {
        slug: "korean-dolsot-bibimbap",
        title: "Dolsot Bibimbap",
        image: "/assets/korean_bibimbap.jpg",
        creatorId: admin.id,
        cuisineId: cuisineMap["korean"]?.id,
        cuisineName: "Korean",
        flag: "🇰🇷",
        minutes: 40,
        difficulty: "Medium",
        category: "Lunch",
        beginner: true,
        rating: 4.7,
        description: "A comforting Korean rice bowl topped with sautéed vegetables, beef, a fried egg, and gochujang sauce.",
        ingredients: ["Cooked Rice", "Bulgogi Beef", "Spinach", "Carrots", "Bean Sprouts", "Egg", "Gochujang"],
        steps: ["Sauté all vegetables separately.", "Cook the marinated beef.", "Heat a stone bowl and brush with sesame oil.", "Add rice to the bowl and let it crisp up.", "Arrange toppings, add fried egg, and serve with gochujang."],
        tip: "Let the rice sit in the hot stone bowl for a few minutes for a crispy bottom!",
        status: "Approved"
      },
      {
        slug: "thai-shrimp-pad-thai",
        title: "Shrimp Pad Thai",
        image: "/assets/thai_pad_thai.jpg",
        creatorId: admin.id,
        cuisineId: cuisineMap["thai"]?.id,
        cuisineName: "Thai",
        flag: "🇹🇭",
        minutes: 30,
        difficulty: "Medium",
        category: "Lunch",
        beginner: true,
        rating: 4.8,
        description: "A classic Thai stir-fried noodle dish with shrimp, peanuts, bean sprouts, and a tangy tamarind sauce.",
        ingredients: ["Rice Noodles", "Shrimp", "Tamarind Paste", "Fish Sauce", "Peanuts", "Bean Sprouts", "Lime"],
        steps: ["Soak rice noodles until pliable.", "Mix tamarind, fish sauce, and sugar for the sauce.", "Stir-fry shrimp and set aside.", "Scramble an egg in the pan, add noodles and sauce.", "Toss everything together and garnish with peanuts and lime."],
        tip: "Make sure all ingredients are prepped before you start cooking as the stir-frying is very fast!",
        status: "Approved"
      },
      {
        slug: "mediterranean-mezze-platter",
        title: "Falafel & Hummus Mezze",
        image: "/assets/mediterranean_falafel.jpg",
        creatorId: admin.id,
        cuisineId: cuisineMap["mediterranean"]?.id,
        cuisineName: "Mediterranean",
        flag: "🫒",
        minutes: 50,
        difficulty: "Medium",
        category: "Snacks",
        beginner: true,
        rating: 4.9,
        description: "A fresh and vibrant Mediterranean sharing platter featuring crispy falafel, creamy hummus, and warm pita bread.",
        ingredients: ["Chickpeas", "Tahini", "Garlic", "Parsley", "Lemon", "Olive Oil", "Pita Bread"],
        steps: ["Blend chickpeas, tahini, lemon, and garlic for hummus.", "Process soaked chickpeas with herbs for falafel.", "Form falafel into balls and deep fry until crispy.", "Prepare a quick cucumber tomato salad.", "Serve all together with warm pita bread."],
        tip: "Always use dried chickpeas soaked overnight for authentic falafel texture!",
        status: "Approved"
      }
    ];

    for (const recipe of newRecipes) {
      const existing = await Recipe.findOne({ where: { slug: recipe.slug } });
      if (!existing) {
        await Recipe.create(recipe);
        console.log(`✅ Added ${recipe.title}`);
      } else {
        console.log(`⏭️ Skipped ${recipe.title} (already exists)`);
      }
    }

    console.log("Seeding all cuisines complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAllCuisines();

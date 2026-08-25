import dotenv from "dotenv";
dotenv.config();

import { sequelize, User, Cuisine, Recipe } from "./server/models/index.js";

const seedMore = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    // Get Sarah Khan as the creator
    const admin = await User.findOne({ where: { email: "sarah@chulha.app" } });
    if (!admin) {
      console.log("Admin not found, skipping.");
      return;
    }

    // Get cuisines
    const turkish = await Cuisine.findOne({ where: { slug: "turkish" } });
    const pakistani = await Cuisine.findOne({ where: { slug: "pakistani" } });
    const mexican = await Cuisine.findOne({ where: { slug: "mexican" } });
    const indian = await Cuisine.findOne({ where: { slug: "indian" } });

    const newRecipes = [
      {
        slug: "turkish-kahvalti-breakfast",
        title: "Traditional Turkish Kahvalti",
        image: "/assets/turkish_breakfast.jpg",
        creatorId: admin.id,
        cuisineId: turkish ? turkish.id : null,
        cuisineName: "Turkish",
        flag: "🇹🇷",
        minutes: 45,
        difficulty: "Medium",
        category: "Breakfast",
        beginner: false,
        rating: 4.9,
        description: "A lavish traditional Turkish breakfast spread featuring Menemen, olives, feta cheese, and fresh bread.",
        ingredients: ["4 Eggs", "2 Tomatoes", "1 Green Pepper", "Feta Cheese", "Olives", "Turkish Tea"],
        steps: [
          "Dice tomatoes and peppers.",
          "Sauté peppers until soft.",
          "Add tomatoes and cook until they break down.",
          "Scramble eggs gently into the mixture.",
          "Serve hot with a large breakfast spread."
        ],
        tip: "Brew the Turkish tea in a double teapot for authentic flavor!",
        status: "Approved"
      },
      {
        slug: "pakistani-chicken-karahi",
        title: "Authentic Chicken Karahi",
        image: "/assets/pakistani_karahi.jpg",
        creatorId: admin.id,
        cuisineId: pakistani ? pakistani.id : null,
        cuisineName: "Pakistani",
        flag: "🇵🇰",
        minutes: 40,
        difficulty: "Easy",
        category: "Dinner",
        beginner: true,
        rating: 4.8,
        description: "A sizzling, spicy Pakistani Chicken Karahi cooked in a traditional iron wok with fresh ginger and green chilies.",
        ingredients: ["1 kg Chicken", "5 Tomatoes", "Ginger Juliennes", "Green Chilies", "Karahi Masala", "Oil"],
        steps: [
          "Fry chicken in oil until golden.",
          "Add halved tomatoes and cover until skin peels off.",
          "Mash tomatoes into a rich gravy.",
          "Add spices and cook on high heat.",
          "Garnish generously with ginger and chilies."
        ],
        tip: "Serve immediately from the wok with hot, fresh naan.",
        status: "Approved"
      },
      {
        slug: "mexican-street-tacos",
        title: "Carne Asada Street Tacos",
        image: "/assets/mexican_tacos.jpg",
        creatorId: admin.id,
        cuisineId: mexican ? mexican.id : null,
        cuisineName: "Mexican",
        flag: "🇲🇽",
        minutes: 30,
        difficulty: "Easy",
        category: "Lunch",
        beginner: true,
        rating: 4.7,
        description: "Authentic Mexican street tacos with grilled carne asada, chopped onions, and cilantro on corn tortillas.",
        ingredients: ["500g Skirt Steak", "Corn Tortillas", "White Onion", "Fresh Cilantro", "Limes", "Salsa Verde"],
        steps: [
          "Marinate steak in citrus and spices.",
          "Grill on high heat until charred.",
          "Chop steak into small cubes.",
          "Warm tortillas on a skillet.",
          "Assemble with meat, onions, cilantro, and a squeeze of lime."
        ],
        tip: "Double up the corn tortillas so they don't break!",
        status: "Approved"
      },
      {
        slug: "indian-mango-lassi",
        title: "Refreshing Mango Lassi",
        image: "/assets/indian_mango_lassi.jpg",
        creatorId: admin.id,
        cuisineId: indian ? indian.id : null,
        cuisineName: "Indian",
        flag: "🇮🇳",
        minutes: 10,
        difficulty: "Easy",
        category: "Drinks",
        beginner: true,
        rating: 4.9,
        description: "A sweet, creamy, and refreshing Indian yogurt-based drink made with fresh sweet mangoes and a hint of cardamom.",
        ingredients: ["1 cup Mango Pulp", "1 cup Plain Yogurt", "2 tbsp Sugar", "Cardamom Powder", "Pistachios"],
        steps: [
          "Combine mango pulp, yogurt, and sugar in a blender.",
          "Blend until smooth and frothy.",
          "Add a pinch of cardamom.",
          "Pour into a tall glass.",
          "Garnish with chopped pistachios and saffron."
        ],
        tip: "Serve chilled with ice cubes during hot summer days.",
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

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMore();

import {
  sequelize,
  User,
  Cuisine,
  Recipe,
  Post,
  Comment,
  Follow,
  Like,
  SavedItem,
  Notification,
  Report,
  Setting,
} from "../models/index.js";

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting Database Sync & Seed with Sequelize...");

    // Sync all tables (force: true drops existing tables for fresh seed)
    await sequelize.sync({ force: true });
    console.log("✅ Database tables synchronized!");

    // 1. Seed Users
    const usersData = [
      {
        name: "Sarah Khan",
        username: "sarahkitchen",
        email: "sarah@chulha.app",
        password: "password123",
        bio: "Home cook in Lahore 🍳 Teaching beginners one dish at a time.",
        emoji: "👩‍🍳",
        role: "Admin",
        status: "Active",
      },
      {
        name: "Ahmed Raza",
        username: "ahmedcooks",
        email: "ahmed@chulha.app",
        password: "password123",
        bio: "Desi flavours, simple steps. Biryani is a personality trait.",
        emoji: "👨‍🍳",
        role: "Moderator",
        status: "Active",
      },
      {
        name: "Mina Aoki",
        username: "minabowls",
        email: "mina@chulha.app",
        password: "password123",
        bio: "Japanese comfort food + tidy kitchens.",
        emoji: "🍱",
        role: "Member",
        status: "Active",
      },
      {
        name: "Luca Bianchi",
        username: "lucapasta",
        email: "luca@chulha.app",
        password: "password123",
        bio: "Nonna-approved pasta only.",
        emoji: "🍝",
        role: "Member",
        status: "Suspended",
      },
      {
        name: "Zara Ali",
        username: "zarabakes",
        email: "zara@chulha.app",
        password: "password123",
        bio: "Cakes, cookies and chaos.",
        emoji: "🎂",
        role: "Member",
        status: "Pending",
      },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`✅ Seeded ${createdUsers.length} users`);

    // 2. Seed Cuisines
    const cuisinesData = [
      { name: "Pakistani", slug: "pakistani", flag: "🇵🇰", image: "/assets/recipe-biryani.jpg" },
      { name: "Indian", slug: "indian", flag: "🇮🇳", image: "/assets/recipe-biryani.jpg" },
      { name: "Italian", slug: "italian", flag: "🇮🇹", image: "/assets/recipe-pizza.jpg" },
      { name: "Chinese", slug: "chinese", flag: "🇨🇳", image: "/assets/recipe-friedrice.jpg" },
      { name: "Japanese", slug: "japanese", flag: "🇯🇵", image: "/assets/recipe-sushi.jpg" },
      { name: "Korean", slug: "korean", flag: "🇰🇷", image: "/assets/recipe-friedrice.jpg" },
      { name: "Mexican", slug: "mexican", flag: "🇲🇽", image: "/assets/recipe-tacos.jpg" },
      { name: "Thai", slug: "thai", flag: "🇹🇭", image: "/assets/recipe-friedrice.jpg" },
      { name: "Turkish", slug: "turkish", flag: "🇹🇷", image: "/assets/hero-table.jpg" },
      { name: "Mediterranean", slug: "mediterranean", flag: "🫒", image: "/assets/recipe-pasta.jpg" },
    ];

    const createdCuisines = await Cuisine.bulkCreate(cuisinesData);
    console.log(`✅ Seeded ${createdCuisines.length} cuisines`);

    const pakistani = createdCuisines.find((c) => c.slug === "pakistani");
    const italian = createdCuisines.find((c) => c.slug === "italian");
    const chinese = createdCuisines.find((c) => c.slug === "chinese");
    const japanese = createdCuisines.find((c) => c.slug === "japanese");
    const mexican = createdCuisines.find((c) => c.slug === "mexican");

    // 3. Seed Recipes
    const recipesData = [
      {
        slug: "chicken-biryani",
        title: "Chicken Biryani",
        image: "/assets/recipe-biryani.jpg",
        creatorId: createdUsers[0].id,
        cuisineId: pakistani?.id,
        cuisineName: "Pakistani",
        flag: "🇵🇰",
        minutes: 60,
        difficulty: "Medium",
        category: "Dinner",
        beginner: false,
        rating: 4.8,
        description: "The weekend classic: fragrant layered rice, tender chicken and crisp fried onions.",
        ingredients: [
          "2 cups basmati rice, rinsed",
          "500 g chicken, cut into pieces",
          "2 onions, thinly sliced",
          "1 cup plain yogurt",
          "2 tomatoes, chopped",
          "2 tbsp biryani masala",
          "1/2 cup cooking oil",
          "Fresh coriander and mint",
          "Salt to taste",
        ],
        steps: [
          "Soak the rinsed rice in water for 30 minutes, then drain.",
          "Fry the sliced onions in oil until golden brown, then set half aside for garnish.",
          "Add chicken, yogurt, tomatoes and masala. Cook until the oil separates.",
          "Boil the rice in salted water until 70% done and drain.",
          "Layer the rice over the chicken, scatter herbs and fried onions.",
          "Cover and steam on low heat for 15 minutes, then fluff gently and serve.",
        ],
        tip: "Keep the heat medium while cooking the onions to avoid burning them.",
        status: "Approved",
      },
      {
        slug: "homemade-margherita-pizza",
        title: "Homemade Margherita Pizza",
        image: "/assets/recipe-pizza.jpg",
        creatorId: createdUsers[3].id,
        cuisineId: italian?.id,
        cuisineName: "Italian",
        flag: "🇮🇹",
        minutes: 45,
        difficulty: "Easy",
        category: "Dinner",
        beginner: true,
        rating: 4.9,
        description: "Fresh dough, rich tomato sauce, melted mozzarella, and fragrant basil.",
        ingredients: [
          "300 g pizza dough",
          "1/2 cup tomato passata",
          "150 g mozzarella, torn",
          "Fresh basil leaves",
          "1 tbsp olive oil",
          "Salt and oregano",
        ],
        steps: [
          "Heat the oven as high as it goes and place a tray inside.",
          "Stretch the dough by hand into a round base on baking paper.",
          "Spread the passata thinly, leaving a border for the crust.",
          "Add mozzarella, a drizzle of oil and a pinch of salt.",
          "Bake 8-10 minutes until the crust is blistered.",
          "Finish with fresh basil and serve immediately.",
        ],
        tip: "Do not overload the base — too many toppings make the middle soggy.",
        status: "Approved",
      },
      {
        slug: "creamy-garlic-pasta",
        title: "Creamy Garlic Pasta",
        image: "/assets/recipe-pasta.jpg",
        creatorId: createdUsers[3].id,
        cuisineId: italian?.id,
        cuisineName: "Italian",
        flag: "🇮🇹",
        minutes: 20,
        difficulty: "Easy",
        category: "Lunch",
        beginner: true,
        rating: 4.7,
        description: "A velvety, restaurant-style garlic cream sauce tossed with pasta in 20 minutes.",
        ingredients: [
          "200 g spaghetti",
          "3 cloves garlic, sliced",
          "3 tbsp butter",
          "1/2 cup cream",
          "Parmesan, grated",
          "Parsley, chopped",
        ],
        steps: [
          "Boil the pasta in well-salted water until just tender.",
          "Melt butter in a pan and soften the garlic gently — do not brown it.",
          "Pour in the cream and a splash of pasta water.",
          "Toss the drained pasta in the sauce.",
          "Add parmesan off the heat and stir until glossy.",
          "Top with parsley and black pepper.",
        ],
        tip: "Save a cup of pasta water — it is the easiest way to loosen a thick sauce.",
        status: "Approved",
      },
      {
        slug: "fluffy-pancakes",
        title: "Fluffy Breakfast Pancakes",
        image: "/assets/recipe-pancakes.jpg",
        creatorId: createdUsers[4].id,
        cuisineName: "American",
        flag: "🥞",
        minutes: 20,
        difficulty: "Easy",
        category: "Breakfast",
        beginner: true,
        rating: 4.9,
        description: "Tall, golden, and cloud-soft pancakes made from everyday pantry ingredients.",
        ingredients: [
          "1 1/2 cups flour",
          "2 tbsp sugar",
          "1 tbsp baking powder",
          "1 1/4 cups milk",
          "1 egg",
          "2 tbsp melted butter",
        ],
        steps: [
          "Whisk the dry ingredients in a bowl.",
          "Beat the milk, egg and butter together separately.",
          "Fold the wet into the dry — lumps are fine.",
          "Rest the batter for 5 minutes.",
          "Cook on a medium pan until bubbles appear, then flip.",
          "Serve warm with syrup and fruit.",
        ],
        tip: "Do not over-mix the batter, or the pancakes turn rubbery instead of fluffy.",
        status: "Approved",
      },
      {
        slug: "egg-fried-rice",
        title: "10-Minute Egg Fried Rice",
        image: "/assets/recipe-friedrice.jpg",
        creatorId: createdUsers[2].id,
        cuisineId: chinese?.id,
        cuisineName: "Chinese",
        flag: "🇨🇳",
        minutes: 15,
        difficulty: "Easy",
        category: "Lunch",
        beginner: true,
        rating: 4.8,
        description: "Quick, savory stir-fried rice loaded with scrambled eggs and colorful veggies.",
        ingredients: [
          "3 cups cold cooked rice",
          "2 eggs, beaten",
          "1/2 cup mixed vegetables",
          "2 spring onions, sliced",
          "2 tbsp soy sauce",
          "1 tbsp oil",
        ],
        steps: [
          "Heat the oil in a wide pan until shimmering.",
          "Scramble the eggs quickly and move them to one side.",
          "Add the vegetables and stir-fry for a minute.",
          "Add the cold rice and break up any clumps.",
          "Season with soy sauce and toss everything together.",
          "Finish with spring onions.",
        ],
        tip: "Use day-old rice from the fridge — fresh rice steams instead of frying.",
        status: "Approved",
      },
      {
        slug: "sushi-rolls-at-home",
        title: "Simple Sushi Rolls",
        image: "/assets/recipe-sushi.jpg",
        creatorId: createdUsers[2].id,
        cuisineId: japanese?.id,
        cuisineName: "Japanese",
        flag: "🇯🇵",
        minutes: 50,
        difficulty: "Hard",
        category: "Dinner",
        beginner: false,
        rating: 4.6,
        description: "Master the art of rolling fresh sushi at home with seasoned rice and crisp nori.",
        ingredients: ["2 cups sushi rice", "Nori seaweed sheets", "Cucumber & avocado strips", "Fresh salmon/tuna", "Soy sauce & wasabi"],
        steps: ["Cook and season sushi rice with vinegar.", "Lay nori on rolling mat.", "Spread rice evenly.", "Add filling and roll tightly.", "Slice into pieces."],
        tip: "Keep your hands wet with vinegar water to prevent rice from sticking.",
        status: "Approved",
      },
      {
        slug: "street-style-tacos",
        title: "Street-Style Tacos",
        image: "/assets/recipe-tacos.jpg",
        creatorId: createdUsers[1].id,
        cuisineId: mexican?.id,
        cuisineName: "Mexican",
        flag: "🇲🇽",
        minutes: 35,
        difficulty: "Medium",
        category: "Dinner",
        beginner: false,
        rating: 4.8,
        description: "Juicy marinated meat in warm corn tortillas topped with chopped onion and fresh cilantro.",
        ingredients: ["Corn tortillas", "500g beef or chicken", "Lime wedges", "Cilantro & diced onion", "Salsa roja"],
        steps: ["Marinate and sear the meat on high heat.", "Warm tortillas on a griddle.", "Fill with meat and garnish."],
        tip: "Char the tortillas lightly for extra smoky flavor.",
        status: "Approved",
      },
      {
        slug: "simple-biryani-for-beginners",
        title: "Simple Biryani for Beginners",
        image: "/assets/recipe-biryani.jpg",
        creatorId: createdUsers[1].id,
        cuisineId: pakistani?.id,
        cuisineName: "Pakistani",
        flag: "🇵🇰",
        minutes: 40,
        difficulty: "Easy",
        category: "Dinner",
        beginner: true,
        rating: 4.9,
        description: "A one-pot beginner version of traditional biryani with maximum aroma.",
        ingredients: ["Basmati rice", "Chicken thighs", "Biryani spices", "Yogurt", "Fried onions"],
        steps: ["Brown the chicken and onions.", "Add spices and yogurt.", "Layer rice and steam on low for 20 mins."],
        tip: "Seal the lid tightly with aluminum foil to trap the steam completely.",
        status: "Approved",
      },
    ];

    const createdRecipes = await Recipe.bulkCreate(recipesData);
    console.log(`✅ Seeded ${createdRecipes.length} recipes`);

    // 4. Seed Posts
    const postsData = [
      {
        userId: createdUsers[0].id,
        kind: "Food Post",
        text: "Made my first homemade pizza today 🍕 The crust actually worked!",
        image: "/assets/recipe-pizza.jpg",
      },
      {
        userId: createdUsers[1].id,
        kind: "Recipe",
        text: "New recipe up: Simple Biryani for Beginners. Only one pot, promise 🍚",
        image: "/assets/recipe-biryani.jpg",
        recipeSlug: "simple-biryani-for-beginners",
      },
      {
        userId: createdUsers[3].id,
        kind: "Cooking Tip",
        text: "Tip of the day: salt your pasta water like the sea. It's the only chance the pasta itself gets seasoned.",
      },
      {
        userId: createdUsers[2].id,
        kind: "Food Post",
        text: "Sunday sushi practice. Rolling is getting easier 🍣",
        image: "/assets/recipe-sushi.jpg",
      },
      {
        userId: createdUsers[4].id,
        kind: "Food Post",
        text: "Pancake stack for a slow morning 🥞",
        image: "/assets/recipe-pancakes.jpg",
      },
    ];

    const createdPosts = await Post.bulkCreate(postsData);
    console.log(`✅ Seeded ${createdPosts.length} posts`);

    // 5. Seed Comments
    const comment1 = await Comment.create({
      userId: createdUsers[1].id,
      recipeId: createdRecipes[0].id,
      text: "This looks incredible! How long did you rest the dough?",
    });

    await Comment.create({
      userId: createdUsers[0].id,
      recipeId: createdRecipes[0].id,
      parentId: comment1.id,
      text: "About an hour on the counter — it made a big difference 🙌",
    });

    await Comment.create({
      userId: createdUsers[4].id,
      recipeId: createdRecipes[0].id,
      text: "Made this last night and my family finished the whole tray 😂",
    });

    await Comment.create({
      userId: createdUsers[2].id,
      postId: createdPosts[0].id,
      text: "Saving this for the weekend. Thank you for the beginner tip!",
    });
    console.log("✅ Seeded initial comments and replies");

    // 6. Seed Follows
    await Follow.bulkCreate([
      { followerId: createdUsers[0].id, followingId: createdUsers[1].id },
      { followerId: createdUsers[1].id, followingId: createdUsers[0].id },
      { followerId: createdUsers[2].id, followingId: createdUsers[0].id },
      { followerId: createdUsers[3].id, followingId: createdUsers[0].id },
      { followerId: createdUsers[4].id, followingId: createdUsers[0].id },
    ]);
    console.log("✅ Seeded follow relationships");

    // 7. Seed Likes & Saved Items
    await Like.bulkCreate([
      { userId: createdUsers[0].id, targetType: "recipe", targetId: createdRecipes[1].id },
      { userId: createdUsers[1].id, targetType: "recipe", targetId: createdRecipes[0].id },
      { userId: createdUsers[2].id, targetType: "post", targetId: createdPosts[0].id },
    ]);

    await SavedItem.bulkCreate([
      { userId: createdUsers[0].id, targetType: "recipe", targetId: createdRecipes[1].id },
      { userId: createdUsers[0].id, targetType: "recipe", targetId: createdRecipes[2].id },
      { userId: createdUsers[1].id, targetType: "recipe", targetId: createdRecipes[4].id },
    ]);
    console.log("✅ Seeded likes and bookmarks");

    // 8. Seed Notifications
    await Notification.bulkCreate([
      {
        recipientId: createdUsers[0].id,
        senderId: createdUsers[1].id,
        action: "liked your pizza post",
        type: "like",
      },
      {
        recipientId: createdUsers[0].id,
        senderId: createdUsers[1].id,
        action: "started following you",
        type: "follow",
      },
      {
        recipientId: createdUsers[0].id,
        senderId: createdUsers[4].id,
        action: 'commented: "This looks so good!"',
        type: "comment",
      },
      {
        recipientId: createdUsers[0].id,
        senderId: createdUsers[2].id,
        action: "saved your Egg Fried Rice recipe",
        type: "save",
      },
    ]);
    console.log("✅ Seeded notifications");

    // 9. Seed Reports
    await Report.bulkCreate([
      {
        target: 'Post · "Buy followers cheap"',
        type: "Post",
        reason: "Spam",
        reporterId: createdUsers[0].id,
        status: "Open",
      },
      {
        target: 'Comment · "this is garbage"',
        type: "Comment",
        reason: "Harassment",
        reporterId: createdUsers[2].id,
        status: "Open",
      },
      {
        target: "User · @fakechef",
        type: "User",
        reason: "Impersonation",
        reporterId: createdUsers[1].id,
        status: "Reviewing",
      },
    ]);
    console.log("✅ Seeded admin reports");

    // 10. Seed Settings
    await Setting.bulkCreate([
      { key: "require_recipe_approval", value: true },
      { key: "auto_hide_reported_posts", value: true },
      { key: "allow_guest_browsing", value: true },
      { key: "beginner_badge_on_easy", value: true },
      {
        key: "community_guidelines",
        value: "Be kind. Credit recipes you adapt. No spam, no hateful language, no unsafe food advice.",
      },
    ]);
    console.log("✅ Seeded community settings");

    console.log("🎉 Database seeding completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// If run directly: `node server/seeders/seed.js`
if (process.argv[1] && process.argv[1].includes("seed.js")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

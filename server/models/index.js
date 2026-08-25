import sequelize from "../config/database.js";
import User from "./User.js";
import Cuisine from "./Cuisine.js";
import Recipe from "./Recipe.js";
import Post from "./Post.js";
import Comment from "./Comment.js";
import Follow from "./Follow.js";
import Like from "./Like.js";
import SavedItem from "./SavedItem.js";
import Notification from "./Notification.js";
import Report from "./Report.js";
import Setting from "./Setting.js";

// --- Associations ---

// User <-> Recipe (Creator)
User.hasMany(Recipe, { foreignKey: "creatorId", as: "recipes" });
Recipe.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

// Cuisine <-> Recipe
Cuisine.hasMany(Recipe, { foreignKey: "cuisineId", as: "recipes" });
Recipe.belongsTo(Cuisine, { foreignKey: "cuisineId", as: "cuisine" });

// User <-> Post
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

// User <-> Comment
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Post <-> Comment
Post.hasMany(Comment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Recipe <-> Comment
Recipe.hasMany(Comment, { foreignKey: "recipeId", as: "comments", onDelete: "CASCADE" });
Comment.belongsTo(Recipe, { foreignKey: "recipeId", as: "recipe" });

// Comment <-> Nested Replies
Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies", onDelete: "CASCADE" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

// User <-> Follows
User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});
User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

// User <-> Likes
User.hasMany(Like, { foreignKey: "userId", as: "likes", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "userId", as: "user" });

// User <-> SavedItems
User.hasMany(SavedItem, { foreignKey: "userId", as: "savedItems", onDelete: "CASCADE" });
SavedItem.belongsTo(User, { foreignKey: "userId", as: "user" });

// User <-> Notification
User.hasMany(Notification, { foreignKey: "recipientId", as: "receivedNotifications", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "recipientId", as: "recipient" });
Notification.belongsTo(User, { foreignKey: "senderId", as: "sender" });

// User <-> Report
User.hasMany(Report, { foreignKey: "reporterId", as: "reports", onDelete: "CASCADE" });
Report.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });

export {
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
};

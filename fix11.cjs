const fs = require('fs');

const append = `
  { month: "Jan", users: 320, recipes: 120, posts: 640, engagement: 42 },
  { month: "Feb", users: 410, recipes: 165, posts: 720, engagement: 48 },
  { month: "Mar", users: 380, recipes: 140, posts: 810, engagement: 51 },
  { month: "Apr", users: 520, recipes: 210, posts: 940, engagement: 58 },
  { month: "May", users: 610, recipes: 240, posts: 1080, engagement: 63 },
  { month: "Jun", users: 720, recipes: 280, posts: 1240, engagement: 71 },
];

export const adminUsers = users.map((u, i) => ({
  ...u,
  email: \`\${u.username}@chulha.app\`,
  role: i === 0 ? "Admin" : i === 1 ? "Moderator" : "Member",
  status: i === 3 ? "Suspended" : i === 4 ? "Pending" : "Active",
}));

export const adminReports = [
  {
    id: "rp1",
    target: 'Post - "Buy followers cheap"',
    type: "Post",
    reason: "Spam",
    reporter: users[0],
    status: "Open",
  },
  {
    id: "rp2",
    target: 'Comment - "this is garbage"',
    type: "Comment",
    reason: "Harassment",
    reporter: users[2],
    status: "Open",
  },
  {
    id: "rp3",
    target: "User - @fakechef",
    type: "User",
    reason: "Impersonation",
    reporter: users[1],
    status: "Reviewing",
  },
  {
    id: "rp4",
    target: 'Recipe - "Dangerous weight loss tea"',
    type: "Recipe",
    reason: "Harmful content",
    reporter: users[3],
    status: "Open",
  },
  {
    id: "rp5",
    target: 'Comment - "You have no idea how to cook"',
    type: "Comment",
    reason: "Hate speech",
    reporter: users[0],
    status: "Dismissed",
  },
  {
    id: "rp6",
    target: "User - @spam_bot_99",
    type: "User",
    reason: "Bot account",
    reporter: users[4],
    status: "Resolved",
  },
];
`;

fs.appendFileSync('src/lib/mock-data.js', append);

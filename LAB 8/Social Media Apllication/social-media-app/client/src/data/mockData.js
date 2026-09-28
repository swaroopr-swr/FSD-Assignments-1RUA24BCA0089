export const currentUser = {
  _id: "u_me",
  username: "swaroop.r",
  displayName: "Swaroop R",
  avatarUrl: "https://picsum.photos/seed/swaroop/150/150",
  bio: "Full Stack Dev student. Coffee enthusiast. Building Margin.",
  followers: 124,
  following: 89,
  postsCount: 12
};

export const users = [
  { _id: "u1", username: "aanya.dev", displayName: "Aanya Rao", avatarUrl: "https://picsum.photos/seed/aanya/150/150" },
  { _id: "u2", username: "rohan_codes", displayName: "Rohan Sharma", avatarUrl: "https://picsum.photos/seed/rohan/150/150" },
  { _id: "u3", username: "priya.design", displayName: "Priya Patel", avatarUrl: "https://picsum.photos/seed/priya/150/150" },
  { _id: "u4", username: "karan.js", displayName: "Karan Singh", avatarUrl: "https://picsum.photos/seed/karan/150/150" },
];

export const mockPosts = [
  {
    _id: "p1",
    author: users[0],
    content: "Finally got my React Router setup working... Nested routes were a nightmare but the breakthrough felt amazing! #webdev #react",
    imageUrl: null,
    likes: 24,
    commentsCount: 6,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isLiked: false
  },
  {
    _id: "p2",
    author: users[1],
    content: "Campus canteen just restocked the good cold coffee. Run, don't walk! 🏃‍♂️☕",
    imageUrl: "https://picsum.photos/seed/margin1/800/600",
    likes: 112,
    commentsCount: 18,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isLiked: true
  },
  {
    _id: "p3",
    author: users[2],
    content: "Working on the new design system for our final year project. The paper texture makes everything feel so tactile.",
    imageUrl: "https://picsum.photos/seed/margin2/800/600",
    likes: 89,
    commentsCount: 12,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isLiked: false
  },
  {
    _id: "p4",
    author: users[3],
    content: "Has anyone started on the Database Management assignment yet? I'm completely stuck on normalizing the third schema.",
    imageUrl: null,
    likes: 5,
    commentsCount: 22,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isLiked: false
  }
];

export const trendingTopics = [
  { id: 1, tag: "EXAMS", count: "1,240 POSTS" },
  { id: 2, tag: "HACKATHON2026", count: "892 POSTS" },
  { id: 3, tag: "WEBDEV", count: "512 POSTS" },
  { id: 4, tag: "CANTEEN", count: "320 POSTS" },
  { id: 5, tag: "WEEKEND", count: "210 POSTS" }
];

export const categories = ["ALL", "CAMPUS", "TECH", "DESIGN", "EVENTS", "STUDY", "MEMES", "SPORTS"];

export const recentActivity = [
  { id: 1, text: "Aanya liked your post", time: "10M AGO" },
  { id: 2, text: "Rohan commented on your post", time: "1H AGO" },
  { id: 3, text: "Priya started following you", time: "2H AGO" },
  { id: 4, text: "Karan liked your post", time: "5H AGO" }
];

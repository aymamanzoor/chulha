// Chulha Frontend API Client

const getAuthHeader = () => {
  const token = localStorage.getItem("chulha_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // --- Auth ---
  async register(data) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(data) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch("/api/auth/me", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // --- Recipes ---
  async getRecipes(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/recipes${query ? `?${query}` : ""}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getRecipeBySlug(slug) {
    const res = await fetch(`/api/recipes/${slug}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async createRecipe(formData) {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return res.json();
  },

  async updateRecipeStatus(id, status) {
    const res = await fetch(`/api/recipes/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async deleteRecipe(id) {
    const res = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async toggleLikeRecipe(id) {
    const res = await fetch(`/api/recipes/${id}/like`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async toggleSaveRecipe(id) {
    const res = await fetch(`/api/recipes/${id}/save`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // --- Posts ---
  async getPosts() {
    const res = await fetch("/api/posts", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async createPost(formData) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return res.json();
  },

  async deletePost(id) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async toggleLikePost(id) {
    const res = await fetch(`/api/posts/${id}/like`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async toggleSavePost(id) {
    const res = await fetch(`/api/posts/${id}/save`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // --- Comments ---
  async getComments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/comments${query ? `?${query}` : ""}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async createComment(data) {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteComment(id) {
    const res = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async toggleLikeComment(id) {
    const res = await fetch(`/api/comments/${id}/like`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // --- Cuisines ---
  async getCuisines() {
    const res = await fetch("/api/cuisines");
    return res.json();
  },

  async getCuisineBySlug(slug) {
    const res = await fetch(`/api/cuisines/${slug}`);
    return res.json();
  },

  async createCuisine(formData) {
    const res = await fetch("/api/cuisines", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return res.json();
  },

  async deleteCuisine(id) {
    const res = await fetch(`/api/cuisines/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // --- Users & Profiles ---
  async getProfile(username) {
    const res = await fetch(`/api/users/profile/${username}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async toggleFollow(userId) {
    const res = await fetch(`/api/users/${userId}/follow`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getSuggestedUsers() {
    const res = await fetch("/api/users/suggested", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // --- Notifications ---
  async getNotifications() {
    const res = await fetch("/api/notifications", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async markNotificationsRead() {
    const res = await fetch("/api/notifications/read-all", {
      method: "PUT",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // --- Admin ---
  async getAdminStats() {
    const res = await fetch("/api/admin/stats", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch("/api/admin/users", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async updateAdminUser(id, data) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAdminUser(id) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getAdminReports() {
    const res = await fetch("/api/admin/reports", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async updateReportStatus(id, status) {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async deleteReport(id) {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getAdminSettings() {
    const res = await fetch("/api/admin/settings", {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async updateAdminSettings(settings) {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ settings }),
    });
    return res.json();
  },
};

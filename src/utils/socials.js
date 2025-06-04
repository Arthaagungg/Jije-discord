const supabase = require("./supabase");

const allowedPlatforms = ["instagram", "tiktok", "x"];

function generateSocialUrl(platform, username) {
  switch (platform) {
    case "instagram": return `https://instagram.com/${username}`;
    case "tiktok": return `https://tiktok.com/@${username}`;
    case "x": return `https://x.com/${username}`;
    default: throw new Error("Platform tidak dikenali");
  }
}

async function getUserSocials(userId) {
  const { data, error } = await supabase
    .from("socials")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

async function addSocial(userId, platform, username) {
  const url = generateSocialUrl(platform, username);
  const { error } = await supabase
    .from("socials")
    .insert([{ user_id: userId, platform, username, url }]);
  if (error) throw error;
}

async function editSocialById(id, platform, newUsername) {
  const newUrl = generateSocialUrl(platform, newUsername);
  const { error } = await supabase
    .from("socials")
    .update({ username: newUsername, url: newUrl })
    .eq("id", id);

  if (error) throw error;
}

async function deleteSocialById(id) {
  const { error } = await supabase
    .from("socials")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

module.exports = {
  getUserSocials,
  addSocial,
  editSocialById,
  removeSocialById,
  allowedPlatforms,
  generateSocialUrl,
};

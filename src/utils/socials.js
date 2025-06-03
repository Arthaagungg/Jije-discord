const supabase = require("./supabase");

const allowedPlatforms = ["instagram", "tiktok", "x"];

async function getUserSocials(userId) {
    const { data, error } = await supabase
        .from("socials")
        .select("*")
        .eq("user_id", userId);

    if (error) throw error;
    return data;
}

async function addSocial(userId, platform, username) {
    if (!allowedPlatforms.includes(platform)) {
        throw new Error("Platform tidak valid");
    }

    const { error } = await supabase
        .from("socials")
        .insert([{ user_id: userId, platform, username }]);

    if (error) throw error;
}

async function editSocial(userId, platform, newUsername) {
    const { error } = await supabase
        .from("socials")
        .update({ username: newUsername })
        .eq("user_id", userId)
        .eq("platform", platform);

    if (error) throw error;
}

async function removeSocial(userId, platform, username) {
    const { error } = await supabase
        .from("socials")
        .delete()
        .eq("user_id", userId)
        .eq("platform", platform)
        .eq("username", username);

    if (error) throw error;
}

module.exports = {
    getUserSocials,
    addSocial,
    editSocial,
    removeSocial,
    allowedPlatforms
};

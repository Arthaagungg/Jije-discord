const supabase = require("./supabase");

const allowedPlatforms = ["instagram", "tiktok", "x"];

/**
 * Generate URL sosial media dari platform dan username
 */
function generateSocialUrl(platform, username) {
    switch (platform) {
        case "instagram":
            return `https://instagram.com/${username}`;
        case "tiktok":
            return `https://tiktok.com/@${username}`;
        case "x":
            return `https://x.com/${username}`;
        default:
            throw new Error("Platform tidak dikenali");
    }
}

async function getUserSocials(userId) {
    const { data, error } = await supabase
        .from("socials")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Supabase error:", error);
        throw error;
    }

    console.log("Data socials:", data);
    return data;
}

async function addSocial(userId, platform, username) {
//    if (!allowedPlatforms.includes(platform)) {throw new Error("Platform tidak valid");}

    const url = generateSocialUrl(platform, username);

    const { error } = await supabase
        .from("socials")
        .insert([{ user_id: userId, platform, username, url }]);

    if (error) throw error;
}

async function editSocial(userId, platform, newUsername) {
    if (!allowedPlatforms.includes(platform)) {
        throw new Error("Platform tidak valid");
    }

    const newUrl = generateSocialUrl(platform, newUsername);

    const { error } = await supabase
        .from("socials")
        .update({ username: newUsername, url: newUrl })
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

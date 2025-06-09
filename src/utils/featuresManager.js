const supabase = require('./supabase');

async function isFeatureEnabled(guildId, botId, feature) {
  const { data, error } = await supabase
    .from('features')
    .select('enabled')
    .eq('guild_id', guildId)
    .eq('bot_id', botId)
    .eq('feature', feature)
    .maybeSingle();

  if (error) {
    console.error('Gagal cek fitur:', error.message);
    return true; // default aktif
  }

  return data?.enabled ?? true;
}

module.exports = { isFeatureEnabled };

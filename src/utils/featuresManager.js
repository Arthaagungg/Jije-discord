const supabase = require('./supabase');

async function isFeatureEnabled(botName, guildId, featureName) {
  const { data, error } = await supabase
    .from('bot_features')
    .select('enabled')
    .eq('bot_name', botName)
    .eq('guild_id', guildId)
    .eq('feature', featureName)
    .maybeSingle();

  if (error) {
    console.error('Error checking feature status:', error);
    return false;
  }

  return data?.enabled ?? false;
}

module.exports = { isFeatureEnabled };

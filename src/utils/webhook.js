// Webhook alert helper for zero-backend push notifications

export function triggerWebhook(webhookUrl, content) {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return;

  try {
    if (webhookUrl.includes('discord.com/api/webhooks')) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "Date Invitation Tracker 💌",
          avatar_url: "https://em-content.zobj.net/source/microsoft-teams/363/sparkling-heart_1f496.png",
          content: content
        })
      }).catch(err => console.warn('Webhook notification error:', err));
    } else {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      }).catch(err => console.warn('Generic webhook notification error:', err));
    }
  } catch (e) {
    console.warn('Could not post to webhook:', e);
  }
}

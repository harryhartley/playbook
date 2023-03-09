import { EmbedBuilder, WebhookClient } from 'discord.js'

export const postToWebhook = () => {
  const webhookClient = new WebhookClient({ id: '', token: '' })

  const embed = new EmbedBuilder().setTitle('Some Title').setColor(0x00ffff)

  void webhookClient.send({
    content: 'Webhook test',
    username: 'some-username',
    avatarURL: 'https://i.imgur.com/AfFp7pu.png',
    embeds: [embed],
  })
}

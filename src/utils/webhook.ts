export const postToWebhook = () => {
  void fetch('http://example.com/movies.json', {
    method: 'POST',
    body: '',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// https://discord.com/api/webhooks/1083424170202890332/0Hw9FX4Vv_jqnW_D82NpiYnGEptkZ8OYpj1nkY3_ZgwfaXjviKo1vTbHk7Uax_IZLkWW

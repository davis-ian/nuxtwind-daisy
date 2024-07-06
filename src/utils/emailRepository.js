export const emailRepository = (fetch) => ({
  async sendNewUserAlert(newEmail) {
    return fetch('new-user-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        subject: 'New User @ ScrapingDemon',
        text: `New signup @ ScrapingDemon! User: ${newEmail}`
      }
    });
  }
});

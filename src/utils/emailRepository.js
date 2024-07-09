export const emailRepository = (fetch) => ({
  async sendNewUserAlert(newEmail) {
    return fetch('email/new-user-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { newEmail }
    });
  },
  async sendConfirmationEmail(userEmail, userReferralCode) {
    return fetch('email/signup-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { userEmail, userReferralCode }
    });
  }
});

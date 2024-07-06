export const userRepository = (fetch) => ({
  async checkExisting(email) {
    return fetch('users/check-existing', {
      method: 'POST',
      body: { email }
    });
  },
  async addEmail(email) {
    return fetch('users/add-to-waitlist', {
      method: 'POST',
      body: { email }
    });
  },
  async fetchReferralCount(referralCode) {
    return fetch('users/referral-count/' + referralCode, {
      method: 'GET'
    });
  },
  async incrementReferralCount(referralCode) {
    return fetch('users/referral-count/increment/' + referralCode, {
      method: 'POST'
    });
  },
  async getPosition(referralCode) {
    return fetch('users/position/' + referralCode, {
      method: 'GET'
    });
  }
});

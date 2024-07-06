import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const email = ref(null);
  const position = ref(null);
  const referralCode = ref(null);

  function updateUser(user) {
    if (user.email) {
      email.value = user.email;
    }

    if (user.position) {
      position.value = user.position;
    }

    if (user.referral_code) {
      referralCode.value = user.referral_code;
    }
  }

  return { email, position, referralCode, updateUser };
});

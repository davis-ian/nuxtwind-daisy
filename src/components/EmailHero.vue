<template>
  <div class="hero">
    <div class="hero-content text-center">
      <div class="max-w-3xl flex flex-col gap-8">
        <h1 class="text-4xl md:text-7xl font-bold text-red-500">
          Scrape. Automate. Dominate.
        </h1>

        <p class="md:text-lg">
          Web scraping and browser automation
          <span class="font-bold">made easy</span>. Automate your reptitive
          online tasks with ScrapingDemon so you can get back to demolishing
          your todo list.
        </p>

        <div>
          <p class="md:text-lg mb-6 text-gray-500 font-thin">
            Sign up to be the first to know when we launch.
          </p>
          <div class="flex justify-center space-x-5">
            <input
              type="text"
              placeholder="Enter email"
              class="input input-bordered w-full max-w-xs"
              v-model="email"
            />
            <button
              :disabled="loading"
              class="btn btn-sm md:btn-md btn-primary"
              @click="captureEmail(email)"
              target="_blank"
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/userStore';
import { emailRepository } from '~/utils/emailRepository';

const route = useRoute();
const email = ref('');
const referrerCode = ref(route.query.ref | null);
const user = ref(null);
const userPosition = ref(null);
const loading = ref(true);

const { showToast } = useToast();

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const { $api } = useNuxtApp();
const userRepo = userRepository($api);
const emailRepo = emailRepository($api);

const checkExistingUser = async (formEmail) => {
  try {
    const response = await userRepo.checkExisting(formEmail);

    const result = response.existingUser;

    return result;
  } catch (error) {
    console.log(error, 'error loggeed');
    throw new Error(
      error.response.data.message || 'Error checking existing user'
    );
  }
};

const getUserPosition = async (referralCode) => {
  try {
    const response = await userRepo.getPosition(referralCode);

    const result = response;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting user position');
  }
};

// const fetchReferralCount = async (referrerCode) => {
//   try {
//     const response = await userRepo.fetchReferralCount(referrerCode);

//     console.log(response.data, 'referral count response');
//     return response.data;
//   } catch (error) {
//     console.lerror('Error fetching referral count: ', error.message);
//     throw error;
//   }
// };

const incrementReferralCount = async (referrerCode) => {
  try {
    const response = await userRepo.incrementReferralCount(referrerCode);
    console.log('inc response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating referral count: ', error.message);
    throw error;
  }
};

const addEmailToWaitlist = async (formEmail) => {
  try {
    const response = await userRepo.addEmail(formEmail);
    const result = response.data;
    console.log(result, 'email added');
    showToast('Email added to waitlist', { type: 'success' });
    return result;
  } catch (error) {
    console.log(error, 'error adding email test');
    throw new Error(error.response.data || 'Error adding email');
  }
};

const sendNewUserEmail = async (newEmail) => {
  try {
    const response = await emailRepo.sendNewUserAlert(newEmail);
    const result = response;
    console.log(result, 'email result');
    return result;
  } catch (error) {
    console.log(error, 'new user alert error');
    throw new Error(error.response.data || 'Error sending new email alertl');
  }
};

const userStore = useUserStore();

const captureEmail = async (formEmail) => {
  if (!validateEmail(formEmail)) {
    showToast('Invalid Email', { type: 'error' });
    return;
  }

  loading.value = true;
  try {
    const existingUser = await checkExistingUser(formEmail);

    if (existingUser) {
      showToast('Email already in waitlist', { type: 'error' });
      return;
    }

    const newUser = await addEmailToWaitlist(formEmail);

    userPosition.value = await getUserPosition(newUser.referral_code);
    user.value = { ...newUser, position: userPosition.value };
    userStore.updateUser(user.value);

    if (referrerCode.value) {
      await incrementReferralCount(referrerCode.value);
    }

    await navigateTo('/success');

    await sendNewUserEmail(formEmail);
  } catch (error) {
    console.log('Error capturing email', error);
  }
  loading.value = false;
};

onMounted(() => {
  loading.value = false;

  if (route.query.ref) {
    referrerCode.value = route.query.ref;
  }
});
</script>

<style lang="scss" scoped></style>

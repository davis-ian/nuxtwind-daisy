<template>
  <div class="hero bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-3xl flex flex-col gap-8">
        <h1 class="text-4xl md:text-7xl font-bold text-red-500">
          Scrape. Automate. Dominate.
        </h1>
        <!-- <img class="border-2 border-primary max-w-48" :src="fireLogo" /> -->

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
            <!-- <button
              :disabled="loading"
              class="btn btn-sm md:btn-md btn-primary"
              @click="getUserPosition('b64f5307-d7a2-459d-aa1c-887f5e5d04df')"
              target="_blank"
            >
              Test position
            </button> -->
            <button class="btn" @click="testUser">open modal</button>
          </div>
        </div>

        <dialog id="user_add_success_modal" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold">Hello!</h3>
            <p class="py-4">Press ESC key or click the button below to close</p>
            <div class="border-2 border-primary" v-if="user">{{ user }}</div>
            <div></div>
            <div class="modal-action">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
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

const testUser = () => {
  const user = { email: 'test', position: 12 };

  userStore.updateUser(user);
};

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
    console.log(newUser, 'new User');

    userPosition.value = await getUserPosition(newUser.referral_code);
    user.value = { ...newUser, position: userPosition.value };
    userStore.updateUser(user.value);

    if (referrerCode.value) {
      await incrementReferralCount(referrerCode.value);
    }

    await navigateTo('/success');

    // await sendNewUserEmail(formEmail);
  } catch (error) {
    console.log('Error capturing email', error);
  }
  loading.value = false;
};

const showSuccessModal = () => {
  user_add_success_modal.showModal();
};

// const hideSuccessModal = () => {
//   user_add_success_modal.close();
// };

onMounted(() => {
  loading.value = false;
  console.log(route.query.ref, 'route');
  if (route.query.ref) {
    referrerCode.value = route.query.ref;
  }

  console.log(referrerCode.value, 'referrer code  val');
});
</script>

<style lang="scss" scoped></style>

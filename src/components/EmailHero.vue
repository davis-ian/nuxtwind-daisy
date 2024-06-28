<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-3xl flex flex-col gap-8">
        <h1 class="text-4xl md:text-7xl font-bold text-red-500">
          Scrape. Automate. Dominate.
        </h1>
        <!-- <img class="border-2 border-primary max-w-48" :src="fireLogo" /> -->

        <p class="md:text-lg">
          Web scraping and browser automation
          <span class="font-bold">made easy</span>. Automate your reptitive
          online tasks with ScrapingDemon so you can get back to killing your
          todo list.
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
              class="btn btn-sm md:btn-md btn-primary"
              @click="captureEmail(email)"
              target="_blank"
            >
              Notify Me
            </button>
          </div>
          <button class="btn btn-primary btn-outline" @click="sendTestEmail">
            Test email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import fireLogo from '@/assets/images/coffin.svg';
import { sendEmail } from '~/composables/useMailgun';
const client = useSupabaseClient();
const route = useRoute();
const email = ref('');
const referrerCode = ref(route.query.ref | null);

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const updateReferrerCodeCount = async (referrerCode) => {
  await client
    .from('waitlist')
    .update({ referral_count: data[0].referral_count + 1 })
    .eq('referral_code', referrerCode);
};

const addEmailToWaitlist = async (formEmail) => {
  const { error } = await client.from('waitlist').insert({ email: formEmail });

  if (error) {
    console.log(error, 'supabase error');

    let errorMessage = 'Error occured, unable to add email';

    if (
      error.message ===
      'duplicate key value violates unique constraint "waitlist_email_key"'
    ) {
      errorMessage = 'Email already added';
    }

    useNuxtApp().$toast(errorMessage, {
      theme: 'auto',
      type: 'error',
      autoClose: 3000,
    });

    return error;
  }
};

const sendTestEmail = async () => {
  try {
    const to = 'iandavis6481@gmail.com';
    const subject = 'Test Email';
    const text = 'This is a test email from ScrapingDemon';
    const response = await sendEmail(to, subject, text);

    console.log('Email success', response);
  } catch (error) {
    console.log('Error sending email from hero: ', error);
  }
};

const captureEmail = async (formEmail) => {
  const isValidEmail = validateEmail(formEmail);

  if (!isValidEmail) {
    useNuxtApp().$toast('Invalid Email', {
      theme: 'auto',
      type: 'error',
      autoClose: '3000',
    });
    return;
  }

  const error = addEmailToWaitlist(formEmail);
  if (error) {
    return;
  }

  if (referrerCode) {
    updateReferrerCodeCount();
  }

  email.value = '';

  useNuxtApp().$toast('Email added to waitlist', {
    theme: 'auto',
    type: 'success',
    autoClose: 3000,
  });
};

onMounted(() => {
  console.log(referrerCode.value);
});
</script>

<style lang="scss" scoped></style>

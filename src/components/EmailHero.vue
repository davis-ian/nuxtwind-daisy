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
          <!-- <button class="btn btn-primary btn-outline" @click="sendTestEmail">
            Test email
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import fireLogo from '@/assets/images/coffin.svg';
// import { sendEmail } from '~/composables/useMailgun';
const supabase = useSupabaseClient();
const route = useRoute();
const email = ref('');
const referrerCode = ref(route.query.ref | null);

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkExistingUser = async (formEmail) => {
  console.log(formEmail, 'form email');
  const { data, error, status } = await supabase
    .from('waitlist_limited_view')
    .select('*')
    .eq();

  console.log(data, 'existing user data');

  return data;
};

const fetchReferralCount = async (referrerCode) => {
  try {
    const { data, error, status } = await supabase
      .from('waitlist')
      .select('referral_count')
      .eq('referral_code', referrerCode)
      .single();

    if (error && status !== 406) throw error;
    return data;
  } catch (error) {
    console.lerror('Error fetching referral count: ', error.message);
    throw error;
  }
};

const incrementReferralCount = async (referrerCode, currentCount) => {
  try {
    const { error } = await supabase
      .from('waitlist')
      .update({ referral_count: currentCount + 1 })
      .eq('referral_code', referrerCode);

    if (error) throw error;
    console.log('Referral count updated successfully');
  } catch (error) {
    console.error('Error updating referral count: ', error.message);
    throw error;
  }
};

const updateReferrerCodeCount = async (referrerCode) => {
  try {
    const data = await fetchReferralCount(referrerCode);

    if (data) {
      await incrementReferralCount(referrerCode, data.referral_count);
    } else {
      console.log('Referrer code not found');
    }
  } catch (error) {
    console.error('Error updating referrer code count: ', error.message);
  }
};

const addEmailToWaitlist = async (formEmail) => {
  const { error } = await supabase
    .from('waitlist')
    .insert({ email: formEmail });

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

    throw new Error(errorMessage);
  }
};

const sendNewUserEmail = async (newEmail) => {
  const config = useRuntimeConfig();
  const toAddress = config.public.EMAIL;
  const message = {
    to: toAddress,
    subject: 'New User @ ScrapingDemon',
    text: `New signup @ ScrapingDemon! User: ${newEmail} `,
  };

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    const result = await response.json();
    if (result.status === 'success') {
      console.log('Email sent successfully!');
    } else {
      console.log('Failed to send email: ' + result.message);
    }
  } catch (error) {
    console.log('An error occurred: ' + error.message);
  }
};

const captureEmail = async (formEmail) => {
  if (!validateEmail(formEmail)) {
    useNuxtApp().$toast('Invalid Email', {
      theme: 'auto',
      type: 'error',
      autoClose: '3000',
    });
    return;
  }

  try {
    const existingUser = await checkExistingUser(formEmail);

    if (existingUser) {
      console.log(existingUser, 'Existing user found');
      return;
    }

    // await addEmailToWaitlist(formEmail);

    // useNuxtApp().$toast('Email added to waitlist', {
    //   theme: 'auto',
    //   type: 'success',
    //   autoClose: 3000,
    // });

    // if (referrerCode.value) {
    //   await updateReferrerCodeCount(referrerCode.value);
    // }

    email.value = '';

    // await sendNewUserEmail(formEmail);
  } catch (error) {
    console.log('Error capturing email', error);
  }
};

onMounted(() => {
  console.log(referrerCode.value);
});
</script>

<style lang="scss" scoped></style>

<template>
  <div class="flex-grow flex justify-center flex-col text-center gap-4">
    <h1 class="text-2xl font-bold">Current Position:</h1>
    <h3 class="text-7xl font-bold">{{ userPosition }}</h3>
    <p>Skip ahead in line by referring friends using the link below:</p>

    <ReferralLinkCopy v-if="referralCode" :referral-code="referralCode" />
  </div>
</template>

<script setup>
const route = useRoute();
const referralCode = ref(route.query.ref | null);
const userPosition = ref(null);

const { $api } = useNuxtApp();
const userRepo = userRepository($api);

const getUserPosition = async (referralCode) => {
  try {
    const response = await userRepo.getPosition(referralCode);

    const result = response.position;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting user position');
  }
};

onMounted(async () => {
  if (route.query.ref) {
    referralCode.value = route.query.ref;

    userPosition.value = await getUserPosition(referralCode.value);
  }
});
</script>

<style lang="scss" scoped></style>

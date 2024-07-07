<template>
  <div class="flex-grow flex flex-col justify-center">
    <div class="text-center flex flex-col gap-8">
      <h1 class="text-4xl md:text-7xl font-bold my-10">
        You're on the waitlist!
      </h1>
      <p>Skip ahead in line by referring friends using the link below:</p>

      <ReferralLinkCopy :referral-code="referralCode" />
      <div>
        <p>Your place in line:</p>
        <p class="text-7xl font-bold mt-2">{{ userStore.position }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();
const referralCode = ref(null);

onMounted(() => {
  referralCode.value = userStore.referralCode;
});
</script>

<style lang="scss" scoped></style>

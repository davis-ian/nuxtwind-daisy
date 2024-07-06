<template>
  <div class="flex-grow flex flex-col justify-center">
    <div class="text-center flex flex-col gap-8">
      <h1 class="text-4xl md:text-7xl font-bold my-10">
        You're on the waitlist!
      </h1>
      <p>Skip ahead in line by referring friends using the link below:</p>
      <div>
        <input
          readonly
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-md"
          v-model="referalLink"
        />
        <button
          :disabled="!referalLink"
          @click="copyLink"
          class="ml-2 btn btn-primary"
        >
          Copy
        </button>
      </div>

      <div>
        <p>Your place in line:</p>
        <p class="text-7xl font-bold mt-2">{{ userStore.position }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { showToast } = useToast();
const userStore = useUserStore();
const referalLink = ref(null);

const copyLink = async () => {
  await navigator.clipboard.writeText(referalLink.value);
  showToast('Copied!', { type: 'success' });
  console.log('copied');
};

onMounted(() => {
  // TODO: handle base url
  referalLink.value = `https://localhost:3000?ref=${userStore.referralCode}`;
});
</script>

<style lang="scss" scoped></style>

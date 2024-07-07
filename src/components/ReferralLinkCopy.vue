<template>
  <div>
    <div>
      <input
        readonly
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full max-w-md"
        :value="referralLink"
      />
      <button
        :disabled="!props.referralCode"
        @click="copyLink"
        class="ml-2 btn btn-primary"
      >
        Copy
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  referralCode: {
    type: String,
    required: true
  }
});

const config = useRuntimeConfig();
const appFront = config.public.APP_FRONT;

const referralLink = computed(() => {
  if (!props.referralCode) return;

  return `${appFront}?ref=${props.referralCode}`;
});

const { showToast } = useToast();

const copyLink = async () => {
  await navigator.clipboard.writeText(props.referralCode);
  showToast('Copied!', { type: 'success' });
};
</script>

<style lang="scss" scoped></style>

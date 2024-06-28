<template>
  <div>
    <select v-model="theme" class="select select-primary md:w-full md:max-w-xs">
      <option disabled selected>Select Theme</option>
      <option v-for="theme in themes" :value="theme" :key="theme">
        <span class="uppercase">{{ theme }}</span>
      </option>
    </select>
  </div>
</template>

<script setup>
const theme = ref(null);
watch(theme, (value) => {
  localStorage.setItem('daisyui-theme', value);
});
onMounted(() => {
  theme.value = localStorage.getItem('daisyui-theme') || 'dark';
});
</script>

<style lang="scss" scoped></style>

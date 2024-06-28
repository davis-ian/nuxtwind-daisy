<template>
  <EmailHero />
</template>

<script setup>
import ogBanner from '../assets/images/nuxtwind-daisy-og-banner.jpg';

definePageMeta({
  layout: 'default',
});
useHead({
  title: 'ScrapingDemon',
  description:
    'ScrapingDemon is a tool designed for seamless web scraping and powerful browser automation.',
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  meta: [
    {
      hid: 'og:image',
      name: 'og:image',
      property: 'og:image',
      content: ogBanner,
    },
  ],
});
</script>

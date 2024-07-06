<template>
  <div class="flex flex-col min-h-screen" :data-theme="theme">
    <div style="top: 0" class="navbar sticky bg-base-100 z-40 shadow-sm">
      <div class="navbar-start">
        <a class="btn btn-ghost md:text-xl">
          <img style="aspect-ratio: 1" class="max-w-10" :src="fireLogo" />
          ScrapingDemon</a
        >
      </div>
      <div class="navbar-center hidden lg:flex">
        <!-- TODO: You can add menu here -->
      </div>
      <div class="navbar-end"></div>
    </div>

    <div class="flex-grow flex flex-col">
      <slot />
    </div>
    <footer class="footer footer-center p-10 bg-base-50">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">ScrapingDemon</h1>
        <p class="md:font-bold">
          Web scraping and browser automation made easy
        </p>
        <p>Copyright © {{ new Date().getFullYear() }} - All right reserved</p>
      </div>
      <!-- <div>
        <div class="grid grid-flow-col gap-4">
          <a href="https://twitter.com/jrtiquez" target="_blank">
            <i class="lab la-twitter text-4xl"></i>
          </a>
          <a
            href="https://github.com/ossphilippines/nuxtwind-daisy"
            target="_blank"
          >
            <i class="lab la-github text-4xl"></i>
          </a>
          <a href="https://facebook.com/ossph.org" target="_blank">
            <i class="lab la-facebook text-4xl"></i>
          </a>
        </div>
      </div> -->
    </footer>
  </div>
</template>

<script setup>
const theme = 'lofi';
import fireLogo from '@/assets/images/coffin.svg';
</script>

export default defineNuxtPlugin({
  setup() {
    const api = $fetch.create({
      baseURL: '/api/'
    });

    return {
      provide: {
        api
      }
    };
  }
});

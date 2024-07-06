/* eslint-disable space-before-function-paren */
export default function useToast() {
  const { $toast } = useNuxtApp();

  const showToast = (message, options = {}) => {
    const defaultOptions = {
      theme: 'auto',
      type: 'default',
      autoClose: 3000,
      ...options
    };

    $toast(message, defaultOptions);
  };

  return {
    showToast
  };
}

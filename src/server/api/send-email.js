// server/api/send-email.post.js
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const apiKey = config.public.MAILGUN_KEY;
  const domain = config.public.MAILGUN_DOMAIN;

  const body = await readBody(event);

  const data = new URLSearchParams();
  data.append('from', `Support <ian@${domain}>`);
  data.append('to', body.to);
  data.append('subject', body.subject);
  data.append('text', body.text);

  try {
    const response = await axios.post(
      `https://api.mailgun.net/v3/${domain}/messages`,
      data,
      {
        auth: {
          username: 'api',
          password: apiKey,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});

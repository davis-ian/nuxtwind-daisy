export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const apiKey = config.MAILGUN_KEY;
  const domain = config.MAILGUN_DOMAIN;
  const toAddress = config.EMAIL;

  const body = await readBody(event);

  const data = new URLSearchParams();
  data.append('from', `Support <ian@${domain}>`);
  data.append('to', toAddress);
  data.append('subject', body.subject);
  data.append('text', body.text);

  try {
    const response = await $fetch(
      `https://api.mailgun.net/v3/${domain}/messages`,
      {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString(
            'base64'
          )}`
        }
      }
    );

    return send(event, JSON.stringify(response));
  } catch (error) {
    return sendError(event, error);
  }
});

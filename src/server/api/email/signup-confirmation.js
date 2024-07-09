export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const apiKey = config.MAILGUN_KEY;
  const domain = config.MAILGUN_DOMAIN;

  const body = await readBody(event);

  const userEmail = body.userEmail;
  const userReferralCode = body.userReferralCode;

  const appFront = config.public.APP_FRONT;

  const referralLink = `${appFront}status?ref=${userReferralCode}`;

  const subject = "You're on the waitlist!";
  const text = `You've been added to the waitlist to be one of the first to user ScrapingDemon. You check check you place in line @ ${referralLink}`;

  const data = new URLSearchParams();
  data.append('from', `Support <ian@${domain}>`);
  data.append('to', userEmail);
  data.append('subject', subject);
  data.append('text', text);

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

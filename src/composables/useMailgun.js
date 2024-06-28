// import axios from 'axios';
// import { Buffer } from 'buffer';

import * as FormData from 'form-data';
import { Mailgun } from 'mailgun.js';

const mailgun = new Mailgun(FormData);

export async function sendEmail(to, subject, text) {
  const config = useRuntimeConfig();

  const apiKey = config.public.MAILGUN_KEY;
  const domain = config.public.MAILGUN_DOMAIN;

  const mg = mailgun.client({
    username: 'api',
    key: apiKey,
  });

  mg.messages
    .create(domain, {
      from: `Excited User <mailgun@${domain}>`,
      to: ['ian@memoryshare.com'],
      subject: 'Hello',
      text: 'Testing some Mailgun awesomeness!',
      html: '<h1>Testing some Mailgun awesomeness!</h1>',
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
}

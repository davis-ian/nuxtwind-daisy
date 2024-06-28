import axios from 'axios';
import { Buffer } from 'buffer';

// eslint-disable-next-line space-before-function-paren
export async function sendEmail(to, subject, text) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const url = `https://api.mailgun.new/v3/${domain}/messages`;

  const auth = 'Basic ' + Buffer.from('api:' + apiKey).toString('base64');

  const data = new URLSearchParams();

  data.append('from', `Excited User <mailgun@${domain}>`);
  data.append('to', to);
  data.append('subject', subject);
  data.append('text', text);

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    console.log('Error sending email: ', error);
    throw error;
  }
}

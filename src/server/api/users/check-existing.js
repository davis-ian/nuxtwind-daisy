import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const body = await readBody(event);

    const { email } = body;

    const { data, error } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email);

    if (error) {
      return sendError(event, error);
    }

    if (data && data.length > 0) {
      return send(event, JSON.stringify({ existingUser: true }));
    }

    return send(event, JSON.stringify({ existingUser: false }));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message })
    );
  }
});

import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const body = await readBody(event);

    const { email } = body;

    const { data, error } = await supabase
      .from('waitlist')
      .insert({ email })
      .select()
      .single();

    if (error) {
      return sendError(event, error);
    }

    return send(event, JSON.stringify({ data }));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message })
    );
  }
});

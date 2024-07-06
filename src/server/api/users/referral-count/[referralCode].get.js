import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const referralCode = getRouterParam(event, 'referralCode');

    const { data, error } = await supabase
      .from('waitlist')
      .select('referral_count')
      .eq('referral_code', referralCode)
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

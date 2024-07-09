import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const referralCode = getRouterParam(event, 'referralCode');

    const { data, error } = await supabase.rpc('get_user_position', {
      referral_code: referralCode
    });

    if (error) {
      return sendError(event, error);
    }

    return send(event, JSON.stringify(data));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message })
    );
  }
});

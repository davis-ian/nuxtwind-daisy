import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const referralCode = getRouterParam(event, 'referralCode');

    const { data: user, error } = await supabase
      .from('waitlist')
      .select('referral_count, created_at')
      .eq('referral_code', referralCode)
      .single();

    if (error) {
      return sendError(event, error);
    }

    const { referral_count: userReferralCount, created_at: userCreatedAt } =
      user;

    const { count, error: countError } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })
      .or(
        `referral_count.gt.${userReferralCount},and(referral_count.eq.${userReferralCount},created_at.lt.${userCreatedAt})`
      );

    if (countError) {
      return sendError(event, countError);
    }

    const result = {
      position: count + 1,
      referralCount: userReferralCount,
      createdAt: userCreatedAt
    };

    return send(event, JSON.stringify(result));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message })
    );
  }
});

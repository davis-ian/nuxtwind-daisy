import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const referralCode = getRouterParam(event, 'referralCode');

    const { data: currentCount, error: fetchError } = await supabase
      .from('waitlist')
      .select('referral_count')
      .eq('referral_code', referralCode)
      .single();

    if (fetchError) {
      return sendError(event, fetchError);
    }

    const newValue = currentCount.referral_count + 1;

    const { data, error: updateError } = await supabase
      .from('waitlist')
      .update({ referral_count: newValue })
      .eq('referral_code', referralCode)
      .select()
      .single();

    if (updateError) {
      return sendError(event, updateError);
    }

    return send(event, JSON.stringify({ data }));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message })
    );
  }
});

// export default defineEventHandler(async (event) => {
//   try {
//     const referralCode = getRouterParam(event, 'referralCode');
//     const currentCount = getRouterParam(event, 'currentCount');

//     const { data, error } = await supabase
//       .from('waitlist')
//       .update({ referral_count: currentCount + 1 })
//       .eq('referral_code', referralCode)
//       .select()
//       .single();

//     if (error) {
//       return sendError(event, error);
//     }

//     return send(event, JSON.stringify({ data }));
//   } catch (error) {
//     return sendError(
//       event,
//       createError({ statusCode: 500, statusMessage: error.message })
//     );
//   }
// });

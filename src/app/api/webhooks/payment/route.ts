import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // 1. Verify SePay Webhook Signature here in a real app
    // e.g. using crypto.createHmac and process.env.SEPAY_WEBHOOK_SECRET
    
    const supabase = createAdminClient();

    // 2. Idempotency Check
    const gatewayTxnId = payload.id?.toString() || payload.reference; 
    const amount = parseInt(payload.transferAmount || payload.amount);
    const description = (payload.content || payload.description || "").toUpperCase();

    const { data: existingTxn } = await supabase
      .from('payment_transactions')
      .select('id')
      .eq('gateway_txn_id', gatewayTxnId)
      .single();

    if (existingTxn) {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // 3. Extract Order Code (regex matching BT[A-Z0-9]{6})
    const match = description.match(/BT[A-Z0-9]{6}/);
    const orderCode = match ? match[0] : null;

    let matchedOrderId = null;

    if (orderCode) {
      // 4. Find Pending Order
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('order_code', orderCode)
        .eq('status', 'pending')
        .single();

      if (order && amount >= order.amount) {
        matchedOrderId = order.id;

        // 5. Fulfill Order (Transaction)
        await supabase.from('orders').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', order.id);
        
        await supabase.from('entitlements').insert({
          user_id: order.user_id,
          chart_id: order.chart_id,
          product_key: order.product_key,
          order_id: order.id
        });
        
        // 6. Trigger AI processing in background (fire-and-forget or client polling)
      }
    }

    // Save transaction log
    await supabase.from('payment_transactions').insert({
      gateway: 'sepay',
      gateway_txn_id: gatewayTxnId,
      raw_payload: payload,
      amount,
      description,
      matched_order_id: matchedOrderId
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

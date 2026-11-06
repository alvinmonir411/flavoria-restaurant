import { NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus } from '@/lib/db';
import { OrderStatus } from '@/types';
import { verifyStaffAuth } from '@/lib/auth-server';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.items || !body.items.length) {
      return NextResponse.json({ error: 'Customer name and order items are required' }, { status: 400 });
    }

    const order = await createOrder({
      orderType: body.orderType || 'Dine-In',
      tableNumber: body.tableNumber,
      customerName: body.customerName,
      customerPhone: body.customerPhone || 'N/A',
      customerEmail: body.customerEmail,
      deliveryAddress: body.deliveryAddress,
      deliveryZone: body.deliveryZone,
      deliveryFee: body.deliveryFee ? Number(body.deliveryFee) : 0,
      scheduledFor: body.scheduledFor || 'ASAP',
      paymentMethod: body.paymentMethod || 'Cash on Delivery',
      paymentStatus: body.paymentStatus || 'pending',
      items: body.items,
      subtotal: body.subtotal ? Number(body.subtotal) : undefined,
      taxAmount: body.taxAmount ? Number(body.taxAmount) : undefined,
      tipAmount: body.tipAmount ? Number(body.tipAmount) : undefined,
      discountAmount: body.discountAmount ? Number(body.discountAmount) : undefined,
      totalAmount: Number(body.totalAmount || 0),
      notes: body.notes || ''
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await verifyStaffAuth(req, [
      'Owner / Admin', 
      'Restaurant Manager', 
      'Executive Chef', 
      'Sous Chef', 
      'Kitchen Staff', 
      'Delivery Staff', 
      'Delivery Driver', 
      'Order Manager'
    ]);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const updated = await updateOrderStatus(body.id, body.status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

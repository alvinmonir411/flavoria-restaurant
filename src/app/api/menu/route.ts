import { NextResponse } from 'next/server';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/db';
import { verifyStaffAuth } from '@/lib/auth-server';

export async function GET() {
  try {
    const items = await getMenuItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyStaffAuth(req, ['Admin', 'Manager']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await req.json();
    if (!body.name || !body.category || body.price === undefined) {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 });
    }

    const newItem = await createMenuItem({
      name: body.name,
      category: body.category,
      description: body.description || '',
      price: Number(body.price),
      isAvailable: body.isAvailable ?? true,
      isSignature: body.isSignature ?? false,
      dietaryTags: Array.isArray(body.dietaryTags) ? body.dietaryTags : [],
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    });

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await verifyStaffAuth(req, ['Admin', 'Manager']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const updated = await updateMenuItem(body.id, {
      name: body.name,
      category: body.category,
      description: body.description,
      price: body.price !== undefined ? Number(body.price) : undefined,
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : undefined,
      isSignature: body.isSignature !== undefined ? Boolean(body.isSignature) : undefined,
      dietaryTags: body.dietaryTags,
      imageUrl: body.imageUrl
    });

    if (!updated) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyStaffAuth(req, ['Admin', 'Manager']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const success = await deleteMenuItem(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}

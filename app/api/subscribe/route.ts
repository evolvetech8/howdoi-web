import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface SubscriberRecord {
  email: string;
  target?: string;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, target = 'both' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Email không hợp lệ.' },
        { status: 400 }
      );
    }

    const newSubscriber: SubscriberRecord = {
      email: email.trim().toLowerCase(),
      target,
      createdAt: new Date().toISOString(),
    };

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'subscribers.json');

    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (e) {
      // ignore if exists
    }

    let subscribers: SubscriberRecord[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      subscribers = JSON.parse(fileContent);
    } catch (e) {
      subscribers = [];
    }

    // Check duplicate
    const exists = subscribers.some((sub) => sub.email === newSubscriber.email);
    if (!exists) {
      subscribers.push(newSubscriber);
      await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công! Cảm ơn bạn đã tham gia cộng đồng EvolveTech.',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi phía máy chủ, vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'subscribers.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const subscribers: SubscriberRecord[] = JSON.parse(fileContent);
    return NextResponse.json({ count: subscribers.length });
  } catch (e) {
    return NextResponse.json({ count: 0 });
  }
}

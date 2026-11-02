import { NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/firebase-service';
import { ContactMessage } from '@/lib/admin-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Anti-spam bot trap (honeypot field)
    if (body.website_trap || body.hp_field) {
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const subject = (body.subject || '').trim();
    const topic = (body.topic || 'General Inquiry').trim();
    const message = (body.message || '').trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a detailed message (minimum 10 characters).' },
        { status: 400 }
      );
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const date = new Date().toISOString();

    const contactMsg: ContactMessage = {
      id,
      name,
      email,
      subject: subject || `${topic} from ${name}`,
      topic,
      message,
      date,
      status: 'unread',
    };

    // Store directly in Firestore
    await FirebaseService.saveContactMessage(contactMsg);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will get back to you shortly.',
      id,
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while submitting your inquiry. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await FirebaseService.getContactMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


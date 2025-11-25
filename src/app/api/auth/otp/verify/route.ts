import { NextResponse } from 'next/server';
import { verifyOtpSignature } from '@/lib/otp';

export async function POST(request: Request) {
    try {
        const { email, otp, hash, expiry } = await request.json();

        if (!email || !otp || !hash || !expiry) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (Date.now() > expiry) {
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
        }

        const isValid = verifyOtpSignature(email, otp, expiry, hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'OTP verified' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}

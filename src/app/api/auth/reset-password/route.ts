import { NextResponse } from 'next/server';
import { verifyOtpSignature } from '@/lib/otp';
import { users } from '@/lib/appwrite-admin';
import { Query } from 'node-appwrite';

export async function POST(request: Request) {
    try {
        const { email, otp, hash, expiry, newPassword } = await request.json();

        if (!email || !otp || !hash || !expiry || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (Date.now() > expiry) {
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
        }

        const isValid = verifyOtpSignature(email, otp, expiry, hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Find user by email
        const userList = await users.list([
            Query.equal('email', email)
        ]);

        if (userList.total === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = userList.users[0];

        // Update password
        await users.updatePassword(user.$id, newPassword);

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
        console.error('Error resetting password:', error);
        return NextResponse.json({
            error: 'Failed to reset password',
            details: error.message
        }, { status: 500 });
    }
}

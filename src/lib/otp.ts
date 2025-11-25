import crypto from 'crypto';

const SECRET = process.env.OTP_SECRET || 'rage-co-otp-secret-key-change-me-in-prod';

export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function signOtp(email: string, otp: string, expiry: number) {
    const data = `${email}.${otp}.${expiry}`;
    return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

export function verifyOtpSignature(email: string, otp: string, expiry: number, signature: string) {
    const expectedSignature = signOtp(email, otp, expiry);
    // Use timingSafeEqual to prevent timing attacks
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSignature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

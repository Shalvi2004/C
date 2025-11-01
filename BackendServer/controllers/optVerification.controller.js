// Generate OTP using crypto for secure random numbers
import crypto from 'crypto';

const generateOTP = () => {
    const num = crypto.randomInt(0, 1000000);
    return String(num).padStart(6, '0');
};

const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in ms

export const otpVerification = async (req, res) => {
    // Logic of sending OTP to user (SMS/Email) can be added here.
    const otp = generateOTP();
    res.json({
        message: 'OTP Generated Successfully',
        otp,
        expiry: otpExpiryTime,
    });
};
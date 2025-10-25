function generateToken(length = 12) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

    const all = upper + lower + digits + symbols;
    let token = '';
    token += upper[Math.floor(Math.random() * upper.length)];
    token += lower[Math.floor(Math.random() * lower.length)];
    token += digits[Math.floor(Math.random() * digits.length)];
    token += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < length; i++) {
        token += all[Math.floor(Math.random() * all.length)];
    }
    return token.split('').sort(() => 0.5 - Math.random()).join('');
}

export const createToken = (req, res) => {
    const password = generateToken(16);
    res.status(200).json({
        success: true,
        token: password,
    });
};
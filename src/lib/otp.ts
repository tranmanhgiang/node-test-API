import { totp } from 'otplib';

class OTP {
    constructor() {
        totp.allOptions();
        totp.options = { digits: 6, step: 3, window: 60 };
    }

    public generate(secret: string, step?: number) {
        if (step) {
            totp.options = { ...totp.options, secret };
        }
        return totp.generate(secret);
    }

    public verify(otp: string, secret: string) {
        return totp.check(otp, secret);
    }
}

export default new OTP();

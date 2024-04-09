import nodemailer from 'nodemailer';

export async function sendVerificationEmail({ email, otp }: { email: string; otp: number }) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'deekshithmogra@gmail.com',
            pass: 'cuwfowxbtgvfvcbi',
        },
    });

    // sending email using transporter
    await transporter.sendMail({
        from: '"Deekshith M D " <deekshith@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Account Verification", // Subject line
        html: `Your OTP to verify your account is ${otp}`, // plain text body
    });

}
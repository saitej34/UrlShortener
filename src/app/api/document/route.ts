import DBConnect from '../../../../lib/DBConnect';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import client from '../../../../usable-functions/redis';

const emailTemplatePath = path.join(process.cwd(), 'public/template.html');
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  let email = body.email;
  console.log(email);
  try {
    await DBConnect();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: "yelagandulasaiteja70@gmail.com",
        pass: "mavdthsgqhyutdep"
        }
        });
        let otp = Math.floor(100000 + Math.random() * 900000)
        const mailOptions = {
            from: 'Secure DOCS',
            to: email,
            subject: 'Secure DOCS | OTP Verification',
            html: emailTemplate.replace('{{otp}}', String(otp)),
            };
        try {
        
        // OTP WILL BE VALID TILL 5 Minutes i.e 300 Seconds
        await client.connect();
        await client.set(email ,otp, {EX: 60*5})
        console.log(await client.get(email))
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        return new NextResponse(JSON.stringify({ status: 'Success', message: "OTP Sent" }));
        } catch (error) {
        console.error('Error sending email: ', error);
        }
        
  } catch (error) {
    console.error('Internal server error:', error);
    return new NextResponse('Error');
  }
}
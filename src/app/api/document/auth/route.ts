import { NextResponse } from 'next/server';
import DBConnect from '../../../../../lib/DBConnect';
import client from '../../../../../usable-functions/redis'
import nodemailer from "nodemailer";
import { type NextRequest } from 'next/server'
import path from 'path';
import fs from 'fs';
import docstore from '../../../../../lib/models/Document';

const hashTemplatePath = path.join(process.cwd(), 'public/hashtemplate.html');
const hashTemplate = fs.readFileSync(hashTemplatePath, 'utf-8');

export async function POST(req: Request, res: Response) 
{
    DBConnect();
    const body = await req.json();
    let otp = body.otp;
    let email = body.email;
    await client.connect();
    let storedOtp = await client.get(email);
    if(!storedOtp)
    {
       return new NextResponse(JSON.stringify({ status : 'Failed' , message : 'OTP Expired Start the Process from start'}));
    }
    if(storedOtp && otp == storedOtp)
    {
      
      return new NextResponse(JSON.stringify({ status: 'Success', message: "OTP Verified"}));
    }
    if(storedOtp && otp != storedOtp)
    {
      return new NextResponse(JSON.stringify({ status: 'Failed', message: "Wrong OTP Entered"}));
    }
    return new NextResponse(JSON.stringify({status : 'Failed', message : "OTP Verification Failed"}));
}
  
export async function GET(req:NextRequest,res:Response)
{
    await DBConnect();
    const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
          user: "yelagandulasaiteja70@gmail.com",
          pass: "mavdthsgqhyutdep"
          }
    });
    const searchParams = req.nextUrl.searchParams
    const email  = searchParams.get('email')
    const hashValue = searchParams.get('hashValue');
    console.log(email + " "+ hashValue) 
    if(!email || !hashValue)
    {
      return new NextResponse(JSON.stringify({ status : 'Failed' , message : 'Error'}));
    }
    const mailOptions = {
    from: 'Secure DOCS',
    to: email,
    subject: 'Secure DOCS | Email Confirmation',
    html: hashTemplate.replace('{{hashValue}}', String(hashValue)),
    };
    let d = {email:email,uniqueKey:hashValue};
    const result = new docstore(d)
    await result.save();
    let info = await transporter.sendMail(mailOptions);
    console.log(info);
    return new NextResponse(JSON.stringify({ status: 'Success', message: "Successfull Verification"}));

}
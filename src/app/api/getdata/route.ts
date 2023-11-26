import DBConnect from '../../../../lib/DBConnect';
import UrlShortModel from '../../../../lib/models/UrlShort';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  try {
    await DBConnect();
    console.log("In API")
    console.log(body);
    let key: string = body.key;
    const existingTargetName = await UrlShortModel.find({ keySearch: key });
    console.log(existingTargetName);

    if (existingTargetName.length > 0) {
      return new NextResponse(JSON.stringify({ status: 'Success', message: existingTargetName[0].targetUrl }));
    }

      return new NextResponse(JSON.stringify({ status: 'Success', message: "No Redirection" }));
  } catch (error) {
    console.error('Internal server error:', error);
    return new NextResponse('Error');
  }
}

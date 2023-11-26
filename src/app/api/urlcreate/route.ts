import findHash from '../../../../usable-functions/findHash';
import DBConnect from '../../../../lib/DBConnect';
import UrlShortModel from '../../../../lib/models/UrlShort';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  try {
    await DBConnect();
    console.log("In API")
    console.log(body);
    let targetUrl: string = body.targetUrl;
    let targetName: string = body.targetName;
    const targetNameChanged= targetName.replace(/ /g, '-');
    const existingTargetName = await UrlShortModel.find({ keySearch: targetName });
    console.log(existingTargetName);

    if (existingTargetName.length !== 0) {
      return new NextResponse(JSON.stringify({ status: 'Failed', message: 'The Name Already Exists' }));
    }

    if (targetName === 'Not Specified') {
      let hash: string = findHash(targetUrl);
      var data = new UrlShortModel({
        targetUrl: targetUrl,
        keySearch: hash,
        createdAt: new Date(),
      });
      await data.save();
      return new NextResponse(JSON.stringify({ status: 'Success', message: hash }));
    } else {
      var data = new UrlShortModel({
        targetUrl: targetUrl,
        keySearch: targetNameChanged,
        createdAt: new Date(),
      });
      await data.save();
      return new NextResponse(JSON.stringify({ status: 'Success', message: targetNameChanged }));
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return new NextResponse('Error');
  }
}

//import * as AWS from 'aws-sdk';

class CommonFunctions {
  public getToken(event: { headers: { [x: string]: string } }) {
    console.log('eventt iss ', event);
    const token = event.headers['Authorization'].split('Bearer')[1];
    console.log('tokentokentoken ', token);
    return token.trim();
  }

  public getTokenFromAuthorizer(event: { authorizationToken: string }) {
    // console.log('eventt iss ',event)
    const token = event.authorizationToken.split('Bearer')[1];
    // console.log('tokentokentoken ', token);
    return token.trim();
  }

  //   public async uploadImageAndGetUrl(base64Image: string) {
  //     try {
  //       const s3 = new AWS.S3({
  //         accessKeyId: process.env.ACCESS_KEY,
  //         secretAccessKey: process.env.SECRET_KEY,
  //         region: process.env.REGION,
  //       });

  //       const base64Data = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  //       // const type = base64Image.split(';')[0].split('/')[1];
  //       const extension = base64Image.substring('data:image/'.length, base64Image.indexOf(';base64'));

  //       console.log('extension ', extension);

  //       const params = {
  //         Bucket: process.env.S3_BUCKIT,
  //         Key: `${Date.now()}.${'png'}`, // type is not required
  //         Body: base64Data,
  //         ACL: 'public-read',
  //         ContentEncoding: 'base64', // required
  //         ContentType: `image/${'png'}`, // required. Notice the back ticks
  //       };

  //       let location = '';
  //       let key = '';
  //       try {
  //         const { Location, Key } = await s3.upload(params).promise();
  //         location = Location;
  //         key = Key;
  //       } catch (error) {
  //         throw new Error('eee in upload image ' + error);
  //       }

  //       console.log(location, key);

  //       return location;
  //     } catch (e) {
  //       throw new Error('eee in upload image ' + e);
  //     }
  //   }

  // todo: not used yet -- need modifications
  public async getBase64FileExtension(base64String: string) {
    switch (base64String.charAt(0)) {
      case '/':
        return 'jpeg';
      case 'i':
        return 'png';
      case 'R':
        return 'gif';
      case 'U':
        return 'webp';
      case 'J':
        return 'pdf';
      default:
        return 'unknown';
    }
  }
}

export default CommonFunctions;

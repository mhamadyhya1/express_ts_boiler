import * as AWS from "aws-sdk";
import {connectToMongoose} from "../../database/mongoose_connect";
import {Context} from "aws-lambda";
import {IProjectAttachment} from "../../entities/projects/models/interfaces/IProjectAttachment";
import {IProjectVoice} from "../../entities/projects/models/interfaces/IProjectVoice";

interface MediaProps {
    newAttachmentsList?: Array<IProjectAttachment>,
    oldAttachmentsList?: Array<IProjectAttachment>,
    newVoicesList?: Array<IProjectVoice>,
    oldVoicesList?: Array<IProjectVoice>,
}

class ImageHelper {

    /// save or delete list of media
    public async uploadDeleteListMediaAndGetList(props: MediaProps) {
        let returnedAttachmentsList: Array<IProjectAttachment> = [];
        let returnedVoicesList: Array<IProjectVoice> = [];

        /// A.1. initialize lists
        let newList: Array<IProjectAttachment> | Array<IProjectVoice>
        let oldList: Array<IProjectAttachment> | Array<IProjectVoice>
        let deleteList: Array<IProjectAttachment> | Array<IProjectVoice> = []

        /// A.2. assign lists to data sent
        if (props.newAttachmentsList != undefined || props.oldAttachmentsList != undefined) {
            newList = props.newAttachmentsList
            oldList = props.oldAttachmentsList != undefined ? props.oldAttachmentsList : []
        } else if (props.newVoicesList != undefined || props.oldVoicesList != undefined) {
            newList = props.newVoicesList
            oldList = props.oldVoicesList != undefined ? props.oldVoicesList : []
        }

        /// A.3. make logic to get the old images that are gonna to delete
        let newListWithFileName = [];
        if (newList != undefined && newList.length > 0) {
            if (props.newAttachmentsList) {
                newListWithFileName = props.newAttachmentsList.filter((element) => element.filename != undefined);
            }
            if (props.newVoicesList) {
                newListWithFileName = props.newVoicesList.filter((element) => element.filename != undefined);
            }

            for (let i = 0; i < oldList.length; i++) {
                const findFile = newListWithFileName.filter((element) => element.filename == oldList[i].filename);

                if(findFile == undefined || findFile.length == 0) {
                    deleteList.push(oldList[i])
                }
            }
        } else {
            deleteList = oldList;
        }

        /// B.1. loop on the new media to add it or ir base64 is empty then only return the old images
        if (newList != undefined && newList.length > 0) {
            for (let i = 0; i < newList.length; i++) {
                const item = newList[i];
                if (item == null) continue;
                if (item.base64 != undefined) {
                    const filename = await this.uploadImageAndGetImageName(item.base64);
                    if (filename != undefined) {
                        const size = this.calculateAttachmentSize(item.base64)
                        if (props.newAttachmentsList != undefined) {
                            const item: IProjectAttachment = newList[i];
                            returnedAttachmentsList.push({
                                filename: filename,
                                filetitle: item.filetitle,
                                size: size
                            })
                        } else if (props.newVoicesList != undefined) {
                            const item: IProjectVoice = newList[i];
                            returnedVoicesList.push({
                                filename: filename,
                                duration: item.duration,
                            })
                        }
                    }
                } else if (item.filename) {
                    if (props.newAttachmentsList != undefined) {
                        const item: IProjectAttachment = newList[i];
                        returnedAttachmentsList.push({
                            filename: item.filename,
                            filetitle: item.filetitle,
                            size: item.size
                        })
                    } else if (props.newVoicesList != undefined) {
                        const item: IProjectVoice = newList[i];
                        returnedVoicesList.push({
                            filename: item.filename,
                            duration: item.duration,
                        })
                    }
                }
            }
        }

        /// B.2. loop on the deleted media to delete it from s3 bucket
        await this.deleteListOfImages(deleteList)

        /// C. return final list
        if (props.newAttachmentsList != undefined) {
            return returnedAttachmentsList;
        } else if (props.newVoicesList != undefined) {
            return returnedVoicesList;
        }
    }

    /// delete media from s3 bucket
    public async deleteListOfImages(listToDelete: Array<IProjectAttachment> | Array<IProjectVoice>) {
        if (listToDelete != undefined && listToDelete.length > 0) {
            for (let i = 0; i < listToDelete.length ; i++) {
                await this.deleteImageUrl(listToDelete[i].filename)
            }
        }
    }

    /// works for both adding or deleting an image
    public async checkImageConditions(context: Context, newBase64Image: string, oldImageName?: string) {
        /// 1. by mongoose
        await connectToMongoose(context);

        let returnedImageName = '';
        /// 1. case of post a modal
        /// add the newBase64Image directly
        if (oldImageName == undefined || oldImageName == '') {
            if (newBase64Image != undefined && newBase64Image != '')
                returnedImageName = await this.uploadImageAndGetImageName(newBase64Image);
        }
        /// 2. case of edit a modal
        else {
            /// a. if the newBase64Image is the same as the oldImageName then we are not doing anything
            if (
                newBase64Image != undefined && newBase64Image != '' &&
                oldImageName != undefined && oldImageName != '' &&
                newBase64Image == oldImageName) {
                returnedImageName = newBase64Image;
            }
            /// b. if the oldImageName is not null then do the logic
            /// first check if the new image is either empty or not the same as the old image
            // and the old image is not empty also
            if (newBase64Image != undefined &&
                (newBase64Image == '' || newBase64Image != oldImageName) &&
                oldImageName != undefined && oldImageName != '') {
                await this.deleteImageUrl(oldImageName)
                returnedImageName = newBase64Image;
            }
            /// c. check if the newBase64Image is not empty and not the same as the old image name
            if (newBase64Image != undefined && newBase64Image != '' && newBase64Image != oldImageName) {
                returnedImageName = await this.uploadImageAndGetImageName(newBase64Image);
            }
        }
        return returnedImageName;
    }

    // upload media to s3 bucket
    public async uploadImageAndGetImageName(base64Image: string) {
        try {
            let imageName = ''
            if (base64Image != undefined && base64Image != '') {

                const {ACCESS_KEY, SECRET_KEY, REGION, S3_BUCKET} = process.env;
                AWS.config.setPromisesDependency(require('bluebird'));
                AWS.config.update({accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY, region: REGION});

                const s3 = new AWS.S3();

                const base64Data = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                const type = base64Image.split(';')[0].split('/')[1]

                const params = {
                    Bucket: S3_BUCKET,
                    Key: `${Date.now()}.${type}`, // type is not required
                    Body: base64Data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64', // required
                    ContentType: `image/${type}` // required. Notice the back ticks
                }

                try {
                    const {Key} = await s3.upload(params).promise();

                    imageName = Key;
                } catch (error) {
                    throw new Error('Error in upload image ' + error);
                }
            }
            return imageName;
        } catch (e) {
            throw new Error('Error in upload image ' + e);
        }
    }

    public async getImageUrl(imageName: string) {
        try {
            const signedUrlExpireSeconds = 60 * 5;

            const {S3_BUCKET} = process.env;
            // AWS.config.setPromisesDependency(require('bluebird'));
            // AWS.config.update({ accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY, region: REGION });
            const s3 = new AWS.S3();
            const params = {
                Bucket: S3_BUCKET,
                Key: imageName, // type is not required
                Expires: signedUrlExpireSeconds// required. Notice the back ticks
            }
            let result = '';
            try {
                result = s3.getSignedUrl('getObject', params);
            } catch (error) {
                throw new Error('Error in getting image url ' + error);
            }
            return result;
        } catch (e) {
            throw new Error('Error in upload image ' + e);
        }
    }

    public async deleteImageUrl(imageName: string) {
        try {
            const {ACCESS_KEY, SECRET_KEY, S3_BUCKET} = process.env;
            AWS.config.update({accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY});
            const s3 = new AWS.S3();
            const params = {
                Bucket: S3_BUCKET,
                Key: imageName
            }
            await s3.deleteObject(params, function (err) {
                if (err) throw new Error('Error in deleting image ' + err);
            }).promise();
        } catch (e) {
            throw new Error('Error in deleting image ' + e);
        }
    }

    public calculateAttachmentSize(base64item: string) {
        const base64Length = base64item.length
        const lastChar = base64item.charAt(base64Length - 1)
        if (lastChar == '=') return (base64Length * (3 / 4)) - 1
        return (base64Length * (3 / 4)) - 2
    }
}

export default ImageHelper;
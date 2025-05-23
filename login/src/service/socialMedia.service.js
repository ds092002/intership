const SocialMedia = require('../model/socialMedia.model');
module.exports = class socialMedialService {
    async addNewUser(body) {
        try {
            return await SocialMedia.create(body);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getUser(body) {
        try {
            return await SocialMedia.findOne(body);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async updateUser(id, body) {
        try {
            return await SocialMedia.findByIdAndUpdate(id, {$set: body}, {new: true});
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
const AdvertisementModel = require('../models/Advertisement');

class AdvertisementRepository {
    async createAdvertisement(advertisement) {
        const newAdvertisement = new AdvertisementModel(advertisement);
        return await newAdvertisement.save();
    }

    async getAdvertisements() {
        return await AdvertisementModel.find();
    }



}
import AdvertisementModel from "../models/Advertisement.js";

class AdvertisementRepository {
  async createAdvertisement(advertisement) {
    const newAdvertisement = new AdvertisementModel(advertisement);
    return await newAdvertisement.save();
  }
  async createAdvertisement(advertisement) {
    const newAdvertisement = new AdvertisementModel(advertisement);
    return await newAdvertisement.save();
  }

  async getAdvertisements() {
    return await AdvertisementModel.find();
  }
}

export default new AdvertisementRepository();
import AdvertisementModel from "../models/Advertisement.js";

class AdvertisementRepository {
  constructor() {
    this.model = AdvertisementModel;
  }
  async createAdvertisement(advertisement) {
    const newAdvertisement = new AdvertisementModel(advertisement);
    return await newAdvertisement.save();
  }

  async getAllAdvertisements() {
    try {
      return await this.model.find({});
    } catch (err) {
      console.err("getAllAdvertisements", err);
      throw err;
    }
  }
}

export default AdvertisementRepository;

import AdvertisementModel from "../models/Advertisement.js";

class AdvertisementRepository {
  async createAdvertisement(advertisement) {
    const newAdvertisement = new AdvertisementModel(advertisement);
    return await newAdvertisement.save();
  }
}
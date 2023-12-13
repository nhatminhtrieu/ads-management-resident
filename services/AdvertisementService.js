import AdvertisementRepository from "../repositories/AdvertisementRepository.js";

export default class AdvertisementService {
  constructor() {
    this.repository = new AdvertisementRepository();
  }

  async getAllAdvertisements() {
    try {
      const advertisements = await this.repository.getAllAdvertisements();
      const locations = advertisements;
      return locations;
    } catch (err) {
      console.log("AdvertisementService.getAllAdvertisement", err);
    }
  }

  async getAllLocations() {
    try {
      const advertisements = await this.repository.getAllAdvertisements();
      const locations = advertisements.filter((item, pos) => {
        return advertisements.indexOf(item) == pos;
      });
      return locations;
    } catch (err) {
      console.log("AdvertisementService.getAllLocations", err);
    }
  }
}

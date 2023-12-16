import ImageRepository from "../database/repositories/ImageRepository.js";

export default class ImageService {
  constructor() {
    this.repository = new ImageRepository();
  }

  async getImageById(id) {
    try {
      const image = await this.repository.getImageById(id);
      return image;
    } catch (err) {
      console.log("ImageService.getImageById", err);
    }
  }
}

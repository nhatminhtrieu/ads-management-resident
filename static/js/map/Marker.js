import Banners from "../service/handleBannerCard.js";
export default class CustomMarker {
  #pinCustom = {
    zoning: {
      background: "#6600ff",
      glyph: "QC",
      glyphColor: "#ffffff",
      borderColor: "#6600ff",
    },
    not_zoning: {
      background: "#caa6ff",
      glyph: "QC",
      glyphColor: "#6600ff",
      borderColor: "#caa6ff",
    },
    current: {
      glyph: (() => {
        const glyImg = document.createElement("img");
        glyImg.src = "../../static/assets/CurrentIcon.svg";
        return glyImg;
      })(),
      scale: 0,
    },
    select: {
      background: "#ff0000",
      glyphColor: "#ffffff",
      scale: 1.5,
    },
    issued: {
      glyph: (() => {
        const glyImg = document.createElement("img");
        glyImg.src = "../../static/assets/IssuedIcon.svg";
        return glyImg;
      })(),
      scale: 0,
    },
    resolved: {
      glyph: (() => {
        const glyImg = document.createElement("img");
        glyImg.src = "../../static/assets/ResolvedIcon.svg";
        return glyImg;
      })(),
      scale: 0,
    },
  };
  #position = {};
  #title = "";
  #type = "";
  #id = "";

  constructor(map, position, title, type = "zoning", id = "") {
    this.map = map;
    this.marker = null;
    this.#position = position;
    this.#title = title;
    this.#type = type;
    this.#id = id;
  }

  async init() {
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary("marker");
    const pin = new PinElement(this.#pinCustom[this.#type]);
    this.marker = new AdvancedMarkerElement({
      position: this.#position,
      map: this.map,
      title: this.#title,
      content: pin.element,
    });
  }

  addListener(change, onChange) {
    this.marker.addListener(change, onChange);
  }

  setMap(map) {
    this.marker.setMap(map);
  }

  setPosition(position) {
    this.marker.position = position;
  }

  getPosition() {
    return this.#position;
  }

  getAdsId() {
    return this.#id;
  }
}

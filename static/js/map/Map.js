import setBanners from "../service/handleBannerCard.js";
export class IMap {
  constructor() {
    this.map = null;
    this.marker = [];
    this.infoWindow = [];
    this.pinCustom = {
      default: {
        background: "#FBBC04",
        glyphColor: "#ff8300",
      },
      ad: {
        background: "#6600ff",
        glyph: "QC",
        glyphColor: "#ffffff",
        borderColor: "#c299ff",
      },
    };
  }

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const currenLocation = await this.getCurrentLocation();
    this.map = new Map(document.getElementById("map"), {
      center: currenLocation,
      zoom: 19,
      mapId: "adf136d39bc00bf9",
    });

    this.pushMarker(currenLocation, "Bạn đang ở đây");
    return this.map;
  }

  async getCurrentLocation() {
    const pos = await new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        reject("Geolocation is not supported by your browser");

      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, reject);
    });
    return pos;
  }

  async pushMarker(position, title, defaultStyle = true, content = title) {
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary("marker");
    console.log(defaultStyle);
    const pin = new PinElement(this.pinCustom["ad"]);
    const marker = new AdvancedMarkerElement({
      position: position,
      map: this.map,
      title,
      content: defaultStyle === true ? null : pin.element,
    });

    const infoWindow = new google.maps.InfoWindow({
      content,
    });

    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map: this.map,
      });
      setBanners();
    });

    this.marker.push(marker);
    infoWindow.open(this.map, marker);
  }

  setMapOnAll(map) {
    this.marker.forEach((marker) => marker.setMap(map));
  }
}

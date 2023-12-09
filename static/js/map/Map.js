import setBanners, { removeBanners } from "../service/handleBannerCard.js";
export class IMap {
  constructor() {
    this.map = null;
    this.marker = [];
    this.currentLocation = null;
    this.currentMarker = null;
    this.infoWindow = [];
    this.pinCustom = {
      default: {
        background: "#FBBC04",
        glyphColor: "#ff8300",
        scale: 1.5,
      },
      ad: {
        background: "#6600ff",
        glyph: "QC",
        glyphColor: "#ffffff",
        borderColor: "#6600ff",
      },
      current: {
        glyph: (() => {
          const glyImg = document.createElement("img");
          glyImg.src = '../../static/assets/CurrentIcon.svg';
          return glyImg;
        })(),
        scale: 0
      }
    };
  }

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    this.currentLocation = await this.getCurrentLocation();
    this.map = new Map(document.getElementById("map"), {
      center: this.currentLocation,
      zoom: 19,
      mapId: "adf136d39bc00bf9",
    });

    this.pushMarker(this.currentLocation, "Bạn đang ở đây", "current");
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

  async pushMarker(position, title, defaultStyle = "", content = title) {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const pin = new PinElement(this.pinCustom[defaultStyle]);
    const marker = new AdvancedMarkerElement({
      position: position,
      map: this.map,
      title,
      content: defaultStyle === "" ? null : pin.element,
    });

    const infoWindow = new google.maps.InfoWindow({
      content,
    });

    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map: this.map,
      });
    });

    marker.addListener("click", () => {
      setBanners();
    });

    position === this.currentLocation ? this.currentMarker = marker : this.marker.push(marker);
  }

  setMapOnAll(map) {
    this.marker.forEach((marker) => marker.setMap(map));
  }

    async convertCoordinate2Address(latlng) {
        const geocoder = new google.maps.Geocoder();
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: latlng })
                .then((response) => {
                    if (response.results[0]) 
                        resolve(response.results[0].formatted_address);
                    else 
                        reject("No results found");
                })
                .catch((e) => reject("Geocoder failed due to: " + e));
        });
    }
}

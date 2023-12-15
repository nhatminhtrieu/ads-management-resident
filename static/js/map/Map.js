import Banners from "../service/handleBannerCard.js";
import CustomMarker from "./Marker.js";
export class IMap {
  constructor() {
    this.map = null;
    this.marker = [];
    this.currentLocation = null;
    this.currentMarker = null;
    this.userSelectedMarker = null;
    this.infoWindow = null;
    this.banners = new Banners();
  }

  async initMap() {
    await google.maps.importLibrary("maps");
    this.currentLocation = await this.getCurrentLocation();
    this.infoWindow = new google.maps.InfoWindow();

    const styledMapType = new google.maps.StyledMapType([
      {
        featureType: "transit.station",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [{ visibility: "on" }],
      },
    ]);

    this.map = new google.maps.Map(document.getElementById("map"), {
      center: this.currentLocation,
      zoom: 19,
      mapId: "adf136d39bc00bf9",
      // Only use normal map type
      mapTypeControlOptions: {
        mapTypeIds: ["roadmap"],
      },
      mapTypeControl: false,
    });

    this.map.mapTypes.set("map", styledMapType);
    this.map.setMapTypeId("map");

    this.updateCurrentLoc(this.currentLocation, "Bạn đang ở đây");
    return this.map;
  }

  async getCurrentLocation() {
    const pos = await new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        reject("Geolocation is not supported by your browser");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // if user denied permission, current location is at HCMUS
          resolve({
            lat: 10.762838024314062,
            lng: 106.68248463223016,
          });
        },
        {
          // this options means that getCurrentPosition will wait for 5s before timeout
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
    return pos;
  }

  async pushCustomMarker(position, title, content = title, zoning = true) {
    const marker = new CustomMarker(
      this.map,
      position,
      title,
      zoning ? "zoning" : "not_zoning"
    );
    await marker.init();
    marker.addListener("click", () => {
      this.infoWindow.setContent(content);
      this.infoWindow.open({
        anchor: marker.marker,
        map: this.map,
      });
      this.banners.setBannersForAds(position);
      this.userSelectedMarker && this.userSelectedMarker.setMap(null);
    });
    this.marker.push(marker);
  }

  updateCurrentLoc(position, title) {
    if (this.currentMarker) {
      this.currentMarker.setPosition(position);
    } else {
      const marker = new CustomMarker(this.map, position, title, "current");
      marker.init().then(() => {
        // Set new marker
        this.currentMarker = marker;
      });
    }
  }
  updateSelectedMarker(position, title) {
    // Clear old marker if exist
    if (this.userSelectedMarker) {
      this.userSelectedMarker.setMap(this.map);
      this.userSelectedMarker.setPosition(position);
      this.infoWindow.close();
    } else {
      const marker = new CustomMarker(this.map, position, title, "select");
      marker.init().then(() => {
        // Set new marker
        this.userSelectedMarker = marker;
      });
    }
  }

  setMapOnAll(map) {
    this.marker.forEach((marker) => marker.setMap(map));
  }

  async getPlacesID(latlng) {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder
        .geocode({ location: latlng })
        .then((response) => {
          if (response.results[0]) resolve(response.results[0].place_id);
          else reject("No results found");
        })
        .catch((e) => reject("Geocoder failed due to: " + e));
    });
  }

  async getDetailsFromCoordinate(latlng) {
    const placeID = await this.getPlacesID(latlng);

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeID}?fields=displayName,formattedAddress&key=AIzaSyCwF9RHdM2Jhzi-hDNJEGvJvEEFos4ViRA`
    );
    const data = await response.json();
    const firstComponentAddress = data.formattedAddress.split(",")[0];

    if (firstComponentAddress === data.displayName.text)
      return {
        name: "Vị trí chưa được đặt tên",
        address: data.formattedAddress,
      };
    else;
    return { name: data.displayName.text, address: data.formattedAddress };
  }
}

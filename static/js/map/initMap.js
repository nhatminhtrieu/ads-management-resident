import initCurrentLocation from "./currentLocation.js";
import loadMarker from "./loadMarker.js";
import moveToCurrenLocation from "../service/moveToCurrentLocation.js";
import toggleContainer from "../service/Toggle.js";
import loadBanners from "../service/bannerInfo.js";

function handleStatus(status) {
  //[switchAds, switchReports]
  //call again function to hide or show ads and reports
}

async function initMap() {
  const map = await initCurrentLocation();
  moveToCurrenLocation(map);
  loadMarker(map);
  loadBanners();

  let status = [false, false];
  toggleContainer(map, (switchAds, switchReports) => {
    status = [switchAds, switchReports];
    handleStatus(status);
  });
}

initMap();

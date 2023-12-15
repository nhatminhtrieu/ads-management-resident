import { IMap } from "./map/Map.js";
import { Service } from "./service/Service.js";
import loadMarker from "./map/loadMarker.js";

// toggle is false means the side bar is being hidden
var toggle = false;
async function main() {
  const map = new IMap();
  await map.initMap();

  const service = new Service(map);

  service.moveToCurrentLocation();
  service.showAllMarker();
  await loadMarker(map);
  service.clusterMarkers();
  service.catchUserSelectedLocation();
  service.preloadCaptcha();
  const toggleButton = document.getElementById("collapse-btn");
  toggleButton.onclick = () => {
    if (toggle) {
      map.banners.hideSidebar();
      toggleButton.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
    } else {
      map.banners.showSidebar();
      toggleButton.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
    }
    toggle = !toggle;
  };
}

main();

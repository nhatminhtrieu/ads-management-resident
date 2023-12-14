import { IMap } from "./map/Map.js";
import { Service } from "./service/Service.js";
import loadMarker from "./map/loadMarker.js";
import { hideSidebar, showSidebar } from "./service/handleBannerCard.js";

// toggle is false means the side bar is being hidden
var toggle = false;
async function main() {
  const map = new IMap();
  await map.initMap();

  const service = new Service(map);

  service.moveToCurrentLocation();
  loadMarker(map);
  const toggleButton = document.getElementById("collapse-btn");
  toggleButton.onclick = () => {
    if (toggle) {
      hideSidebar();
      toggleButton.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
    } else {
      showSidebar();
      toggleButton.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
    }
    toggle = !toggle;
  };
}

main();

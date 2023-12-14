import { IMap } from "./map/Map.js";
import { Service } from "./service/Service.js";
import loadMarker from "./map/loadMarker.js";
async function main() {
  const map = new IMap();
  await map.initMap();

  const service = new Service(map);

  service.moveToCurrentLocation();
  service.showAllMarker();
  loadMarker(map);
  map.map.addListener("click", (event) => {
    map.pushMarker(event.latLng, "Vị trí bạn chọn", "default");
  });
}

main();

import { IMap } from "./map/Map.js";
import { Service } from "./service/Service.js";
async function main() {
    const map = new IMap();
    await map.initMap();

    const service = new Service(map);
    
    service.moveToCurrenLocation();
    service.showAllMarker();

    map.map.addListener("click", (event) => {
        map.mark(event.latLng, "Vị trí bạn chọn");
    });
}

main();
import { IMap } from "./map/Map.js";
import { Service } from "./service/Service.js";
import loadMarker from "./map/loadMarker.js";
import SideBar from "./service/SideBar.js";

// toggle is false means the side bar is being hidden
var toggle = false;
async function main() {
  const map = new IMap();
  await map.initMap();

  const service = new Service(map);

  service.moveToCurrentLocation();
  service.showAllMarker();
  service.preloadCaptcha();
  await loadMarker(map);
  service.clusterMarkers();
  service.catchUserSelectedLocation();
  // localStorage.setItem("name", "GeeksforGeeks");
  // localStorage.setItem("color", "green");

  // // Updating data
  // localStorage.setItem("name", "GeeksforGeeks(GfG)");
  // localStorage.setItem("color", "Blue");

  // // Get the data by key
  // let name = localStorage.getItem("name");
  // console.log("This is - ", name);
  // let color = localStorage.getItem("color");
  // console.log("Value of color is - ", color);

  // // Get key on a given position
  // let key1 = localStorage.key(1);
  // console.log(key1);

  // // Get number of stored items
  // let items = localStorage.length;
  // console.log("Total number of items is ", items);

  // // Remove key with its value
  // localStorage.removeItem("color");
  // localStorage.setItem("idReport", JSON.stringify([1, 2]));
  console.log(localStorage);
  // const idReport = localStorage.getItem("idReport");
  // console.log(JSON.parse(idReport));
}

main();

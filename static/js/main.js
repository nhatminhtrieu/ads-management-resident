import { IMap } from "./map/Map.js";
import { Service } from "./service/Service.js";
import loadMarker from "./map/loadMarker.js";
import Form from "./service/Form.js";

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
  await service.loadReportMarkers();
  service.clusterMarkers();

  const form = new Form(map);
  service.catchUserSelectedLocation(form);
  service.catchUserClickMarker(form);
  form.resetFormFields();
  const captcha = await service.verifyCaptcha();
  form.setCaptcha(captcha);
  form.catchUserSubmitReport();

  const sideBar = new SideBar();
  sideBar.init(map);
}

main();

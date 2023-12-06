import initCurrentLocation from "./currentLocation.js";

import moveToCurrenLocation from "../service/moveToCurrentLocation.js";
<<<<<<< Updated upstream
import toggleContainer  from "../service/Toggle.js";
=======
import toggleContainer from "../service/Toggle.js";
>>>>>>> Stashed changes

function handleStatus(status) {
  //[switchAds, switchReports]
  //call again function to hide or show ads and reports
}

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
async function initMap() {
  const map = await initCurrentLocation();
  moveToCurrenLocation(map);

<<<<<<< Updated upstream
  let status = [false, false]
  toggleContainer(map, (switchAds, switchReports) => {
    status = [switchAds, switchReports]
    handleStatus(status)
  });
}

initMap();
=======
  let status = [false, false];
  toggleContainer(map, (switchAds, switchReports) => {
    status = [switchAds, switchReports];
    handleStatus(status);
  });
}

initMap();
>>>>>>> Stashed changes

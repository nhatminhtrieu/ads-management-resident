import advertisement from "../mocks/advertisement.js";

export default function loadMarker(map) {
  const contentString =
    "<div class='card' style='width: 18rem;padding:0; border:none'>" +
    `<h5 class="card-title">${advertisement.typeAds}</h5>` +
    `<p class="card-text">${advertisement.typeLoc}</p>` +
    `<p class="card-text">${advertisement.address}</p>` +
    `<p class="card-text" style='font-weight:bold; font-style: italic'>${
      advertisement.use ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
    }</p>` +
    "</div>";
  map.pushMarker(
    advertisement.coordinate,
    advertisement.title,
    "ad",
    contentString
  );
}

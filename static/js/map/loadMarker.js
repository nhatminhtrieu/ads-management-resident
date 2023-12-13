function createContent(advertisement) {
  const contentString =
    "<div class='card' style='width: 18rem;padding:0; border:none'>" +
    `<h5 class="card-title">${advertisement.typeAds}</h5>` +
    `<p class="card-text">${advertisement.typeLoc}</p>` +
    `<p class="card-text">${advertisement.address.formatted_text}</p>` +
    `<p class="card-text" style='font-weight:bold; font-style: italic'>${
      advertisement.zoning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
    }</p>` +
    "</div>";
  return contentString;
}
export default function loadMarker(map) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    const list = JSON.parse(xhttp.responseText);
    list.forEach((ad) => {
      const contentString = createContent(ad);
      map.pushMarker(ad.coordinate, ad.title, "ad", contentString);
    });
  };
  xhttp.open("GET", "http://localhost:3456/advertisement", true);
  xhttp.send();
}

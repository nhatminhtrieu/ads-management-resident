const mock = {
  title: "Cổ động chính trị",
  type: "Đất công/Công viên/Hành lang an toàn giao thông",
  addr: "Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao), Phường Bến Nghé, Quận 1",
  use: true,
};
export default async function loadMarker(map) {
  await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const home = { lat: 10.776848, lng: 106.698769 };
  const pinBackground = new PinElement({
    background: "#FBBC04",
    glyphColor: "#ff8300",
  });
  const contentString =
    "<div class='card' style='width: 18rem;padding:0; border:none'>" +
    `<h5 class="card-title">${mock.title}</h5>` +
    `<p class="card-text">${mock.type}</p>` +
    `<p class="card-text">${mock.addr}</p>` +
    `<p class="card-text" style='font-weight:bold; font-style: italic'>${
      mock.use ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
    }</p>` +
    "</div>";
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: "Home",
  });

  const advancedMarker = new AdvancedMarkerElement({
    position: home,
    map: map,
    title: mock.title,
    content: pinBackground.element,
  });

  const marker = new google.maps.Marker({
    position: home,
    map: map,
    title: "Home",
    label: {
      text: "QC",
      color: "#ffffff",
      fontSize: "14px",
    },
  });
  advancedMarker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
    });
  });
}

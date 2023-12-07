const mock = {
  title: "Cổ động chính trị",
  type: "Đất công/Công viên/Hành lang an toàn giao thông",
  addr: "Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao), Phường Bến Nghé, Quận 1",
  use: true,
};

export default function loadMarker(map) {
  const home = { lat: 10.776848, lng: 106.698769 };
  const contentString =
    "<div class='card' style='width: 18rem;padding:0; border:none'>" +
    `<h5 class="card-title">${mock.title}</h5>` +
    `<p class="card-text">${mock.type}</p>` +
    `<p class="card-text">${mock.addr}</p>` +
    `<p class="card-text" style='font-weight:bold; font-style: italic'>${
      mock.use ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
    }</p>` +
    "</div>";
  map.pushMarker(home, mock.title, false, contentString);
}

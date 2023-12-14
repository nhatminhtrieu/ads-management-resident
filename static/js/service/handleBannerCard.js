function createCard(cardInfo) {
  const card = document.createElement("div");
  card.classList.add("card", "card-body");
  const title = document.createElement("h5");
  title.classList.add("card-title");
  title.innerText = cardInfo.typeBoard;

  const address = document.createElement("p");
  address.classList.add("card-text");
  address.innerText = cardInfo.address["formatted_text"];

  const list = document.createElement("ul");
  list.innerHTML = `<li>Kích thước: <em>${cardInfo.size}</em></li>\
    <li>Số lượng: <em>${cardInfo.number}</em></li>\
    <li>Hình thức: <em>${cardInfo.typeAds}</em></li>\
    <li>Phân loại: <em>${cardInfo.typeLoc}</em</li>\
  `;

  const row = document.createElement("div");
  row.classList.add("btn-row");
  row.innerHTML =
    '<button class="btn btn-icon">\
      <i class="bi bi-info-circle"></i>\
      </button>\
      <button class="btn btn-outline-danger">\
      <i class="bi bi-exclamation-octagon-fill"></i> Báo cáo vi phạm\
      </button>\
  ';

  card.appendChild(title);
  card.appendChild(address);
  card.append(list);
  card.appendChild(row);
  return card;
}

export function hideSidebar() {
  let description = document.getElementById("side-bar");
  description.style.width = "0px";
}

export function showSidebar() {
  let description = document.getElementById("side-bar");
  description.style.width = "408px";
}

export default function setBanners(coordinate) {
  let description = document.getElementById("description");
  description.style.display = "block";
  let cardList = document.createElement("div");
  cardList.classList.add("card-list");
  cardList.id = "card-list";
  const xhttp = new XMLHttpRequest();
  xhttp.onload = () => {
    const ads = JSON.parse(xhttp.responseText);
    ads.forEach((ad) => {
      const card = createCard(ad);
      cardList.appendChild(card);
      description.innerHTML = "";
      description.appendChild(cardList);
    });
  };
  xhttp.open(
    "GET",
    `http://localhost:3456/advertisement?lat=${coordinate.lat}&lng=${coordinate.lng}`,
    true
  );
  xhttp.send();
}

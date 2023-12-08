import advertisement from "../mocks/advertisement.js";

function createCard(cardInfo) {
  const card = document.createElement("div");
  card.classList.add("card", "card-body");
  const title = document.createElement("h5");
  title.classList.add("card-title");
  title.innerText = cardInfo.typeBoard;

  const address = document.createElement("p");
  address.classList.add("card-text");
  address.innerText = cardInfo.address;

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

  const list = document.createElement("ul");
  list.innerHTML = `<li>Kích thước: <em>${cardInfo.size}</em></li>\
    <li>Số lượng: <em>${0}</em></li>\
    <li>Hình thức: <em>${cardInfo.typeAds}</em></li>\
    <li>Phân loại: <em>${cardInfo.typeLoc}</em</li>\
  `;
  card.appendChild(title);
  card.appendChild(address);
  card.append(list);
  card.appendChild(row);
  return card;
}

export function removeBanners() {
  let description = document.getElementById("description");
  description.style.display = "none";
  const cardList = description.getElementById("card-list");
  description.removeChild(cardList);
}

export default function setBanners() {
  let description = document.getElementById("description");
  description.style.display = "block";
  let cardList = document.createElement("div");
  cardList.classList.add("card-list");
  cardList.id = "card-list";

  const card = createCard(advertisement);
  cardList.appendChild(card);

  description.innerHTML = "";
  description.appendChild(cardList);
}

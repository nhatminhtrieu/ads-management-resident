import advertisment from "../mocks/advertisment.json";

function createCard(cardInfo) {
  const card = document.createElement("div");
  card.classList.add("card", "card-body");
  const title = document.createElement("h5");
  title.classList.add("card-title");
  const address = document.createElement("p");
  address.classList.add("card-text");

  title.innerText = cardInfo.title;
  address.innerText = cardInfo.address;
  card.appendChild(title);
  card.appendChild(address);
}
export default function bannerInfo() {
  let cardList = document.getElementById("card-list");
  const card = createCard(advertisment);
  cardList.appendChild(card);
}

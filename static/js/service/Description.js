import Card from "./Card.js";
import CardList from "./CardList.js";

const DATABASE = "http://localhost:3456";
class Description {
	constructor() {
		this.root = document.createElement("div");
		this.root.classList.add("h-100");
		this.cardList = new CardList();

		this.infoModal = document.querySelector("#infoModal");
		this.infoModalBody = document.querySelector("#infoModal .modal-body");
		this.default = `
		<div class="h-100 d-flex justify-content-center align-items-center fs-2 text-secondary">
			Chưa có thông tin
		</div>
		`;
		this.root.innerHTML = this.default;
	}

	createModalForAd(ad) {
		const wrap = document.createElement("div");
		wrap.setAttribute("id", "wrap", "d-none");

		const img = document.createElement("img");
		img.style = `width: 400px; height: 300px; object-fit: cover;`;
		fetch(`${DATABASE}/image?id=${ad.imgs[0]}`)
			.then((response) => {
				return response.json();
			})
			.then((image) => {
				img.setAttribute("src", image.url);
			})
			.catch((error) => {
				img.setAttribute(
					"src",
					"https://images.unsplash.com/photo-1553096442-8fe2118fb927?ixid=M3w1NDE3MjR8MHwxfHNlYXJjaHwxfHxhZHZlcnRpc2VtZW50fGVufDB8fHx8MTcwMjc0NjU0MHww&ixlib=rb-4.0.3"
				);
			});

		const exp = new Date(ad.exp);
		const date = document.createElement("div");
		date.innerHTML = `<strong>Ngày hết hạn hợp đồng:</strong> ${exp.toLocaleString("en-GB", {
			timeZone: "UTC",
		})} GMT`;

		wrap.appendChild(img);
		wrap.appendChild(date);

		this.infoModalBody.appendChild(wrap);
	}

	handleViewDetail() {
		const infoBtns = document.querySelectorAll("button#info");
		infoBtns &&
			infoBtns.forEach((btn, id) => {
				btn.addEventListener("click", () => {
					const contents = document.querySelectorAll("#infoModal .modal-body div#wrap");
					contents.forEach((content) => (content.style = `display: none !important;`));
					contents[
						id
					].style = `display: flex !important; flex-direction: column; align-items: center; gap: 20px;`;
				});
			});
	}

	setCardsForAds(coordinate) {
		// Clear the card list
		this.cardList.reset();
		this.infoModalBody.innerHTML = "";

		fetch(`${DATABASE}/advertisement?lat=${coordinate.lat}&lng=${coordinate.lng}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((ads) => {
				ads.forEach((ad) => {
					const card = new Card(ad);
					this.cardList.append(card.root);
					this.root.innerHTML = "";
					this.root.appendChild(this.cardList.root);
					this.createModalForAd(ad);
				});

				this.handleViewDetail();
			})
			.catch((error) => console.error(error));
	}

	setCardsForUserSelection(info) {
		// Clear the old banner
		this.cardList.reset();

		const card1 = new Card(info, "nonads");
		const card2 = new Card(info, "userselection");

		this.cardList.append(card1.root);
		this.cardList.append(card2.root);
		this.root.innerHTML = "";
		this.root.appendChild(this.cardList.root);
	}

	setCardsForReport(info) {
		this.cardList.reset();
		const card = new Card(info, "report");
		this.cardList.append(card.root);
		this.root.innerHTML = "";
		this.root.appendChild(this.cardList.root);
	}

	reset() {
		this.root.innerHTML = this.default;
	}
}

export default Description;

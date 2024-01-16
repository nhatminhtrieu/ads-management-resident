import GeoService from "../map/GeoService.js";
import { Card, CardList } from "./Card.js";
import SearchBar from "./SearchBar.js";
import DATABASE from "../dbConfig.js";

export default class SideBar {
	constructor() {
		this.sidebar = document.getElementById("side-bar");
		this.tabs = document.querySelectorAll(".tab-icon");
		this.tabContents = document.querySelectorAll(".tab-content");
		this.button = document.getElementById("collapse-btn");
		this.visible = false;

		this.searchBar = new SearchBar();
		this.defaultContent = `<div class="h-100 d-flex justify-content-center align-items-center fs-3 text-center text-secondary">
			Chưa có thông tin, vui lòng chọn 1 điểm trên bản đồ
		</div>`;
		this.infoModal = document.querySelector("#infoModal");
		this.infoModalBody = document.querySelector("#infoModal .modal-body");
	}

	init(map) {
		this.tabs.forEach((tab, id) => {
			tab.onclick = () => {
				this.setActive(id);
			};
		});
		this.searchBar.init(map);
		this.tabContents[0].innerHTML = "";
		this.tabContents[0].appendChild(this.searchBar.root);

		this.tabs[3].onclick = async () => {
			await this.savedReports();
			this.setActive(3);
		};

		this.button.onclick = () => this.toggleVisible();
	}

	async savedReports() {
		let cardList = new CardList();
		this.tabContents[3].innerHTML = "";
		const data = localStorage.getItem("idReports");
		if (!data) localStorage.setItem("idReports", "[]");
		const idReports = JSON.parse(localStorage.getItem("idReports"));
		let count = 0;
		for (let i = 0; i < idReports.length; i = i + 1) {
			const response = await fetch(`${DATABASE}/resident/report/detail?id=${idReports[i]}`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const report = await response.json();
			if (report) count = count + 1;
			const card = new Card(report, "report");
			cardList.append(card.root);
		}
		console.log(count);
		if (count) {
			this.tabContents[3].appendChild(cardList.root);
		} else {
			this.tabContents[3].innerHTML = `<div class="h-100 d-flex justify-content-center align-items-center fs-3 text-center text-secondary">
			Bạn chưa gửi báo cáo nào
		</div>`;
		}
	}

	setActive(index) {
		this.tabs.forEach((tab) => {
			tab.classList.remove("tab-active");
		});
		this.tabs[index].classList.add("tab-active");

		this.tabContents.forEach((tab) => {
			tab.classList.add("d-none");
		});
		this.tabContents[index].classList.remove("d-none");
	}

	show() {
		this.sidebar.style.width = "480px";
		this.button.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
		this.visible = true;
	}

	hide() {
		this.sidebar.style.width = "0px";
		this.button.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
		this.visible = false;
	}

	// Show/Hide the side bar
	toggleVisible() {
		if (this.visible) this.show();
		else this.hide();
		this.visible = !this.visible;
	}

	createModalForAd(ad) {
		const wrap = document.createElement("div");
		wrap.setAttribute("id", "wrap", "d-none");
		let imgContainer = document.createElement("div");
		imgContainer.classList.add("row", "gx-2");
		imgContainer.style = `    max-height: ${ad.used ? "208px" : "416px"};
		overflow-y: scroll;`;
		imgContainer.innerHTML = `
			<div class='col'>Không có ảnh</div>
		`;
		if (ad.imgs.length == 1) {
			imgContainer.innerHTML = "";
			const img = document.createElement("img");
			img.classList.add("col", "rounded");
			img.style = "height: 400px; object-fit: cover";
			img.setAttribute("src", ad.imgs[0]);
			imgContainer.appendChild(img);
		} else if (ad.imgs.length > 0) {
			imgContainer.innerHTML = "";
			ad.imgs.forEach((url) => {
				const img = document.createElement("img");
				img.classList.add("col-6", "mb-2", "px-1", "rounded");
				img.style = "height: 200px; object-fit: cover";
				img.setAttribute("src", url);
				imgContainer.appendChild(img);
			});
		}
		const date = document.createElement("div");
		date.innerHTML = "<strong>Chưa có quảng cáo được cấp phép</strong>";
		const adContainer = document.createElement("div");
		if (ad.used) {
			const adHeader = document.createElement("h5");
			adHeader.classList.add("text-center", "mb-4");
			adHeader.innerText = "Hình ảnh quảng cáo được cấp phép";
			adContainer.appendChild(adHeader);
			const adImgs = document.createElement("div");
			adImgs.classList.add("row", "gx-2", "justify-content-center");
			adImgs.style = `max-height: 208px; overflow-y: scroll; `;
			ad.used.imgs.forEach((url) => {
				const img = document.createElement("img");
				img.classList.add("col-6", "mb-2", "px-1", "rounded");
				img.style = "height: 200px; object-fit: cover; max-width: 100%";
				img.setAttribute("src", url);
				adImgs.appendChild(img);
			});
			adContainer.appendChild(adImgs);
			const exp = new Date(ad.used.end);
			date.innerHTML = `<strong>Ngày hết hạn hợp đồng:</strong> ${exp.toLocaleDateString("en-GB", {
				timeZone: "UTC",
			})}`;
		}
		wrap.appendChild(imgContainer);
		wrap.appendChild(adContainer);
		wrap.appendChild(date);

		this.infoModalBody.appendChild(wrap);
		this.infoModal.querySelector(".modal-content").style = "width: 600px";
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

	setCardsForAds(location) {
		let cardList = new CardList();
		this.infoModalBody.innerHTML = "";
		fetch(`${DATABASE}/resident/advertisement?location=${location._id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then(async (ads) => {
				if (ads.length == 0) {
					const geolocation = new GeoService();
					this.setCardsForUserSelection(
						await geolocation.getDetailsFromCoordinate(location.coordinate)
					);
				} else {
					ads.forEach((ad) => {
						const card = new Card(ad, "ads");
						cardList.append(card.root);
						this.tabContents[1].innerHTML = "";
						this.tabContents[1].appendChild(cardList.root);
						this.setActive(1);
						this.reset([2]);
						this.createModalForAd(ad);
					});

					this.handleViewDetail();
				}
			})
			.catch((error) => console.error(error));
	}

	setCardsForUserSelection(info) {
		let cardList = new CardList();
		const card1 = new Card(info, "nonads");
		const card2 = new Card(info, "userselection");

		cardList.append(card1.root);
		cardList.append(card2.root);

		this.tabContents[1].innerHTML = "";
		this.tabContents[1].appendChild(cardList.root);
		this.setActive(1);
		this.reset([2]);
	}

	setCardsForReport(info) {
		let cardList = new CardList();
		const card = new Card(info, "report");
		cardList.append(card.root);
		this.tabContents[2].innerHTML = "";
		this.tabContents[2].appendChild(cardList.root);
		this.setActive(2);
		this.reset([1]);
	}

	reset(tabs = []) {
		tabs.forEach((tab) => {
			this.tabContents[tab].innerHTML = this.defaultContent;
		});
	}
}

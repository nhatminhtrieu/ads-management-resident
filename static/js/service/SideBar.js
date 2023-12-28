import Card from "./Card.js";
import CardList from "./CardList.js";
import SearchBar from "./SearchBar.js";
import Description from "./Description.js";

const DATABASE = "http://localhost:3456";
export default class SideBar {
	constructor() {
		this.sidebar = document.getElementById("side-bar");
		this.menu = document.getElementById("menu");
		this.tabs = Array.from(menu.children);
		this.description = document.getElementById("description");
		this.button = document.getElementById("collapse-btn");
		this.active = 0;
		this.visible = false;
		this.contents = [];
		this.searchBar = new SearchBar();
		this.defaultContent = new Description();
	}

	initContent(tabIndex, tabOnclick = () => {}, tabContent = this.defaultContent.root) {
		this.contents[tabIndex] = tabContent;
		this.tabs[tabIndex].onclick = () => {
			this.setActive(tabIndex);
			tabOnclick();
		};
	}

	init(map) {
		this.tabs[this.active].classList.add("tab-active");
		this.tabs.forEach((tab, id) => {
			this.contents.push(this.defaultContent.root);
			tab.onclick = () => {
				this.setActive(id);
			};
		});

		this.searchBar.init(map);
		this.initContent(0, () => {}, this.searchBar.root);
		this.initContent(3, async () => {
			await this.savedReports();
		});
		this.description.innerHTML = "";
		console.log(this.contents);
		this.description.appendChild(this.contents[this.active]);
		this.button.onclick = () => this.toggleVisible();
	}

	async savedReports() {
		this.description.innerHTML = "";
		let cardList = new CardList();
		const idReports = JSON.parse(localStorage.getItem("idReports"));
		for (let i = 0; i < idReports.length; i = i + 1) {
			const response = await fetch(`${DATABASE}/report/detail?id=${idReports[i]}`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const report = await response.json();
			const card = new Card(report, "report");
			cardList.append(card.root);
		}
		this.description.appendChild(cardList.root);
	}

	setActive(index) {
		console.log(`Change active ${index}`);
		this.tabs[this.active].classList.remove("tab-active");
		this.tabs[index].classList.add("tab-active");
		this.active = index;
		this.description.innerHTML = "";
		this.description.appendChild(this.contents[index]);
		console.log(this.contents);
	}

	show() {
		this.sidebar.style.width = "480px";
		this.button.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
	}

	hide() {
		this.sidebar.style.width = "0px";
		this.button.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
	}

	// Show/Hide the side bar
	toggleVisible() {
		if (this.visible) {
			this.show();
		} else {
			this.hide();
		}
		this.visible = !this.visible;
	}
}

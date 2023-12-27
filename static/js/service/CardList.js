export default class CardList {
	constructor() {
		this.list = document.createElement("div");
		this.list.classList.add("column");
	}

	append(newItem) {
		this.list.appendChild(newItem);
	}

	reset() {
		this.list.replaceChildren("");
	}
}

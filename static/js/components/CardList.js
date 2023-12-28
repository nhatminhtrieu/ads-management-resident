export default class CardList {
	constructor() {
		this.root = document.createElement("div");
		this.root.classList.add("column");
		this.root.id = "card-list";
	}

	append(newItem) {
		this.root.appendChild(newItem);
	}

	reset() {
		this.root.replaceChildren("");
	}
}

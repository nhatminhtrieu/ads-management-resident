import Form from "./Form.js";
const DATABASE = "http://localhost:3456";

class Card {
	#map = {
		ads: this.#createAds,
		nonads: this.#createNonAds,
		report: this.#createReport,
		userselection: this.#createUserSelection,
	};

	constructor(info, type = "ads") {
		this.root = this.#map[type](info);
		this.info = info;
		this.handleClick = () => {};
	}

	#createAds(info) {
		const card = document.createElement("div");
		card.classList.add("card", "card-body", "mb-3");
		const title = document.createElement("h5");
		title.classList.add("card-title");
		title.innerText = info.typeBoard;

		const address = document.createElement("p");
		address.classList.add("card-text");
		address.innerText = info.address["formatted_text"];

		const list = document.createElement("ul");
		list.innerHTML = `<li>Kích thước: <em>${info.size}</em></li>\
		<li>Số lượng: <em>${info.number}</em></li>\
		<li>Hình thức: <em>${info.typeAds}</em></li>\
		<li>Phân loại: <em>${info.typeLoc}</em</li>\
		`;

		const row = document.createElement("div");
		row.classList.add("btn-row");
		row.innerHTML =
			'<button type="button" class="btn btn-icon" id="info" data-bs-toggle="modal" data-bs-target="#infoModal">\
        <i class="bi bi-info-circle"></i>\
        </button>';

		const button = document.createElement("button");
		button.classList.add("btn", "btn-outline-danger");
		button.id = "report";
		button.setAttribute("data-bs-toggle", "modal");
		button.setAttribute("data-bs-target", "#reportModal");
		button.innerHTML = `<i class="bi bi-exclamation-octagon-fill"></i> Báo cáo vi phạm`;
		button.onclick = () => {
			document.getElementById("id").value = info._id ? info._id : "";
			document.getElementById("coordinate").value = JSON.stringify(info.coordinate);
		};
		row.appendChild(button);

		card.appendChild(title);
		card.appendChild(address);
		card.append(list);
		card.appendChild(row);
		return card;
	}

	#createNonAds(_info) {
		const card = document.createElement("div");
		card.classList.add("card", "card-body", "non-ads-card", "col-12", "mb-3");
		card.innerHTML = `<div class="row">\
            <div class="col-1">\
                <i class="bi bi-info-circle"></i>\
                </div>\
                <div class="col-11">\
                    <h5 class="card-title">Thông tin bảng quảng cáo</h5>\
                    <div class="card-text">\
                    <strong> Chưa có dữ liệu! </strong>\
                    <div>Vui lòng chọn điểm trên bản đồ để xem</div>\
                </div>\
            </div>\
        </div>`;
		return card;
	}

	#createReport(info) {
		const card = document.createElement("div");
		card.classList.add("card", "card-body", "mb-3");

		const list = document.createElement("div");
		list.innerHTML = `
		<h5 class="card-title">${info.typeReport}</h5>
		<ul>
			<li>Email: <em>${info.email}</em></li>\
			<li>Họ và tên: <em>${info.name}</em></li>\
			<li>Số điện thoại: <em>${info.phone}</em></li>\
			<li>Nội dung báo cáo: ${info.content}</li>\
		</ul>
		`;

		card.append(list);

		info.imgs.forEach((imgId) => {
			const img = document.createElement("img");
			img.style = `padding-bottom: "20px"`;
			fetch(`${DATABASE}/image?id=${imgId}`)
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
			card.append(img);
		});

		const status = document.createElement("p");
		status.classList.add("card-text", "fw-bold", "fst-italic");
		status.innerText = info.type === "issued" ? "CHƯA XỬ LÝ" : "ĐÃ XỬ LÝ";
		card.append(status);
		return card;
	}

	#createUserSelection(info) {
		const card = document.createElement("div");
		card.classList.add("card", "card-body", "user-selection-card", "col-12", "mb-3");
		card.innerHTML = `<div class="row mb-3">
            <div class="col-1">
                <i class="bi bi-check2-circle"></i>
            </div>
            <div class="col-11">
                <h5 class="card-title">Thông tin địa điểm</h5>
                <div class="card-text">
                    <strong> ${info.name} </strong>
                    <div> ${info.address} </div>
                </div>
            </div>
        </div>
        <div class="btn-row">
            <div></div>
        </div>`;
		const button = document.createElement("button");
		button.classList.add("btn", "btn-outline-danger");
		button.id = "report";
		button.setAttribute("data-bs-toggle", "modal");
		button.setAttribute("data-bs-target", "#reportModal");
		button.innerHTML = `<i class="bi bi-exclamation-octagon-fill"></i> Báo cáo vi phạm`;
		button.onclick = () => {
			console.log(info);
			document.getElementById("id").value = info._id;
			document.getElementById("coordinate").value = JSON.stringify(info.coordinate);
		};
		card.getElementsByClassName("btn-row")[0].appendChild(button);
		return card;
	}
}

class CardList {
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

export { Card, CardList };

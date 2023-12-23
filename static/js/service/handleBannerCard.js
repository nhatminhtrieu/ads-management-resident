class Banners {
  constructor() {
    this.root = document.createElement("div");

    this.cardList = document.createElement("div");
    this.cardList.classList.add("card-list");
    this.cardList.id = "card-list";

    this.sidebar = document.getElementById("side-bar");

    this.infoModal = document.querySelector("#infoModal");
    this.infoModalBody = document.querySelector("#infoModal .modal-body");
  }

  hideSidebar() {
    this.sidebar.style.width = "0px";
  }

  showSidebar() {
    this.sidebar.style.width = "408px";
  }

  createCardForAds(cardInfo) {
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
      '<button type="button" class="btn btn-icon" id="info" data-bs-toggle="modal" data-bs-target="#infoModal">\
        <i class="bi bi-info-circle"></i>\
        </button>\
        <button class="btn btn-outline-danger" id="report" data-bs-toggle="modal" data-bs-target="#reportModal">\
        <i class="bi bi-exclamation-octagon-fill"></i> Báo cáo vi phạm\
        </button>\
    ';

    card.appendChild(title);
    card.appendChild(address);
    card.append(list);
    card.appendChild(row);
    return card;
  }

  setBannersForAds(coordinate) {
    // Clear the old banner
    this.cardList.innerHTML = "";
    this.infoModalBody.innerHTML = "";

    fetch(
      `http://localhost:3456/advertisement?lat=${coordinate.lat}&lng=${coordinate.lng}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((ads) => {
        ads.forEach((ad) => {
          const card = this.createCardForAds(ad);
          this.cardList.appendChild(card);
          this.root.innerHTML = "";
          this.root.appendChild(this.cardList);

          const modal = this.createModalForAd(ad);
        });

        this.handleViewDetail();
      })
      .catch((error) => console.error(error));
  }

  createCardForNonAds() {
    const card = document.createElement("div");
    card.classList.add("card", "card-body", "non-ads-card", "col-12");

    const row = document.createElement("div");
    row.classList.add("row");

    const leftSide = document.createElement("div");
    leftSide.classList.add("col-1");
    leftSide.innerHTML = '<i class="bi bi-info-circle"></i>';

    const rightSide = document.createElement("div");
    rightSide.classList.add("col-11");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerText = "Thông tin bảng quảng cáo";

    const info = document.createElement("div");
    info.classList.add("card-text");
    info.innerHTML = `<strong> Chưa có dữ liệu! </strong>
        <div>Vui lòng chọn điểm trên bản đồ để xem</div>`;

    rightSide.appendChild(title);
    rightSide.appendChild(info);

    row.appendChild(leftSide);
    row.appendChild(rightSide);

    card.appendChild(row);
    return card;
  }

  createCardForUserSelection(cardInfo) {
    const card = document.createElement("div");
    card.classList.add("card", "card-body", "user-selection-card", "col-12");

    const row = document.createElement("div");
    row.classList.add("row", "mb-3");

    const leftSide = document.createElement("div");
    leftSide.classList.add("col-1");
    leftSide.innerHTML = '<i class="bi bi-check2-circle"></i>';

    const rightSide = document.createElement("div");
    rightSide.classList.add("col-11");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerText = "Thông tin địa điểm";

    const info = document.createElement("div");
    info.classList.add("card-text");
    info.innerHTML = `<strong> ${cardInfo.name} </strong>
        <div> ${cardInfo.address} </div>`;

    const functionRow = document.createElement("div");
    functionRow.classList.add("btn-row");
    // Use empty div to align the button to the right
    functionRow.innerHTML = `<div></div>
      <button class="btn btn-outline-danger" id="report" data-bs-toggle="modal" data-bs-target="#reportModal">
        <i class="bi bi-exclamation-octagon-fill"></i> Báo cáo vi phạm
      </button>`;

    rightSide.appendChild(title);
    rightSide.appendChild(info);

    row.appendChild(leftSide);
    row.appendChild(rightSide);

    card.appendChild(row);
    card.appendChild(functionRow);
    return card;
  }

  setBannersForUserSelection(cardInfo) {
    // Clear the old banner
    this.cardList.innerHTML = "";

    const card1 = this.createCardForNonAds();
    const card2 = this.createCardForUserSelection(cardInfo);

    this.cardList.appendChild(card1);
    this.cardList.appendChild(card2);
    this.root.innerHTML = "";
    this.root.appendChild(this.cardList);
  }

  createModalForAd(ad) {
    const wrap = document.createElement("div");
    wrap.setAttribute("id", "wrap");
    wrap.style = `display: none;`;

    const img = document.createElement("img");
    img.style = `width: 400px; height: 300px; object-fit: cover;`;
    fetch(`http://localhost:3456/image?id=${ad.imgs[0]}`)
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
    date.innerHTML = `<strong>Ngày hết hạn hợp đồng:</strong> ${exp.toLocaleString(
      "en-GB",
      { timeZone: "UTC" }
    )} GMT`;

    wrap.appendChild(img);
    wrap.appendChild(date);

    this.infoModalBody.appendChild(wrap);
  }

  handleViewDetail() {
    const infoBtns = document.querySelectorAll("button#info");
    infoBtns &&
      infoBtns.forEach((btn, id) => {
        btn.addEventListener("click", () => {
          const contents = document.querySelectorAll(
            "#infoModal .modal-body div#wrap"
          );
          contents.forEach(
            (content) => (content.style = `display: none !important;`)
          );
          contents[
            id
          ].style = `display: flex !important; flex-direction: column; align-items: center; gap: 20px;`;
        });
      });
  }

  createCardForReport(report) {
    const card = document.createElement("div");
    card.classList.add("card", "card-body");
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerText = report.typeReport;

    const list = document.createElement("ul");
    list.innerHTML = `<li>Email: <em>${report.email}</em></li>\
      <li>Họ và tên: <em>${report.name}</em></li>\
      <li>Số điện thoại: <em>${report.phone}</em></li>\
      <li>Nội dung báo cáo: ${report.content}</li>\
    `;

    card.appendChild(title);
    card.append(list);

    report.imgs.forEach((imgId) => {
      const img = document.createElement("img");
      img.style = `padding-bottom: "20px"`;
      fetch(`http://localhost:3456/image?id=${imgId}`)
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
    status.classList.add("card-text");
    status.style = "font-weight:bold; font-style: italic";
    status.innerText = report.type === "issued" ? "CHƯA XỬ LÝ" : "ĐÃ XỬ LÝ";

    card.append(status);

    return card;
  }

  setBannersForReport(report) {
    this.cardList.innerHTML = "";

    const card = this.createCardForReport(report);
    this.cardList.appendChild(card);
    this.root.innerHTML = "";
    this.root.appendChild(this.cardList);
  }
}

export default Banners;

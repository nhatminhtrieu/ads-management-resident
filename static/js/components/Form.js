import DATABASE from "../dbConfig.js";

export default class Form {
	constructor(map) {
		this.modal = document.querySelector("#reportModal");
		this.form = document.querySelector("form#reportForm");
		this.typeInput = document.getElementById("type");
		this.nameInput = document.getElementById("name");
		this.idInput = document.getElementById("id");
		this.coordinateInput = document.getElementById("coordinate");
		this.emailInput = document.getElementById("email");
		this.phoneInput = document.getElementById("phone");
		this.contentInput = document.getElementById("content");
		this.imgsInput = document.querySelector("input#formFileMultiple");
		this.submitBtn = document.querySelector('button[type="submit"]');
		this.map = map;
		this.info = {};
		this.captcha = false;
	}

	setCaptcha(verify) {
		this.captcha = verify;
	}

	async saveImgs(files) {
		const filePromises = files.map((file) => {
			return new Promise((res, rej) => {
				let fileReader = new FileReader();
				fileReader.onload = function () {
					return res(fileReader.result);
				};
				fileReader.readAsDataURL(file);
			});
		});
		const fileIds = await Promise.all(filePromises);

		return fileIds;
	}

	catchUserSubmitReport() {
		this.validateForm();

		this.form.addEventListener("submit", async (event) => {
			event.preventDefault();

			const files = this.imgsInput.files;
			const imgsId = await this.saveImgs(Array.from(files));
			const content =
				"<div class='card' style='width: 18rem;padding:0; border:none'>" +
				`<h5 class="card-title">${this.typeInput.options[this.typeInput.selectedIndex].text}</h5>` +
				`<p class="card-text">${this.emailInput.value}</p>` +
				`<p class="card-text" style='font-weight:bold; font-style: italic'>CHƯA XỬ LÝ</p>` +
				"</div>";
			const response = await fetch(`${DATABASE}/resident/report/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: this.idInput.value !== "undefined" ? this.idInput.value : null,
					coordinate: JSON.parse(this.coordinateInput.value),
					typeReport: this.typeInput.value,
					email: this.emailInput.value,
					name: this.nameInput.value,
					phone: this.phoneInput.value,
					content: this.contentInput.value,
					imgs: imgsId,
					type: "Đã tiếp nhận",
				}),
			});

			try {
				const outcome = await response.json();
				console.log("Outcome: ", outcome);
				let idReports = JSON.parse(localStorage.getItem("idReports"));
				if (idReports == null) idReports = [];
				idReports.push(outcome._id);
				localStorage.setItem("idReports", JSON.stringify(idReports));
				this.map.pushReportMarker(outcome, "", content);
			} catch (error) {
				console.log("Error parsing JSON response:", error);
			}
		});
	}

	resetFormFields() {
		this.modal.addEventListener("show.bs.modal", () => {
			this.form.reset();
			this.submitBtn.setAttribute("disabled", "");
		});
	}

	checkValid() {
		if (
			this.typeInput.value !== "" &&
			this.nameInput.value !== "" &&
			this.emailInput.value !== "" &&
			this.phoneInput.value !== "" &&
			tinymce.get("content").getContent() !== "" &&
			!this.imgsInput.classList.contains("is-invalid") &&
			this.imgsInput.files.length
		)
			return true;
		return false;
	}

	validateFile(files) {
		let sum = 0;
		files.map((file) => (sum += file.size / 1024 / 1024));
		if (sum > 10) return false;
		else return true;
	}

	validateForm() {
		const tmpThis = this;

		this.imgsInput.addEventListener("change", function (e) {
			const files = e.currentTarget.files;

			const validateImgs = tmpThis.validateFile(Array.from(files));

			if (!validateImgs || files.length > 2) {
				tmpThis.imgsInput.classList.add("is-invalid");
				tmpThis.submitBtn.setAttribute("disabled", "");
			} else {
				tmpThis.imgsInput.classList.contains("is-invalid") &&
					tmpThis.imgsInput.classList.remove("is-invalid");

				tmpThis.checkValid()
					? tmpThis.captcha && tmpThis.submitBtn.removeAttribute("disabled")
					: tmpThis.submitBtn.setAttribute("disabled", "");
			}
		});

		tinymce.activeEditor.on("keypress keyup", () => {
			tmpThis.checkValid()
				? tmpThis.submitBtn.removeAttribute("disabled")
				: tmpThis.submitBtn.setAttribute("disabled", "");
		});

		document.querySelectorAll("input").forEach((input) => {
			input.addEventListener("change", () => {
				tmpThis.checkValid()
					? tmpThis.submitBtn.removeAttribute("disabled")
					: tmpThis.submitBtn.setAttribute("disabled", "");
			});
		});
	}
}

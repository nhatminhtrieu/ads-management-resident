export default class Form {
  constructor(map) {
    this.modal = document.querySelector("#reportModal");
    this.form = document.querySelector("form#reportForm");
    this.typeInput = document.getElementById("type");
    this.nameInput = document.getElementById("name");
    this.emailInput = document.getElementById("email");
    this.phoneInput = document.getElementById("phone");
    this.contentInput = document.getElementById("content");
    this.imgsInput = document.querySelector("input#formFileMultiple");
    this.submitBtn = document.querySelector('button[type="submit"]');
    this.map = map;
    this.pos = {};
    this.adsId = "";
  }

  setPosition(coordinate) {
    this.pos = coordinate;
  }

  setAdsId(id) {
    this.adsId = id;
  }

  async saveImgs(files) {
    const filePromises = files.map((file) => {
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const response = await fetch("http://localhost:3456/image/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: reader.result,
                caption: file.name,
                createAt: new Date(),
              }),
            });

            res(await response.json());
          } catch (error) {
            rej(error);
          }
        };
        reader.readAsDataURL(file);
      });
    });
    const fileIds = await Promise.all(filePromises);

    return fileIds;
  }

  catchUserSubmitReport() {
    this.resetFormFields();
    this.validateForm();

    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const files = this.imgsInput.files;
      const imgsId = await this.saveImgs(Array.from(files));
      const content =
        "<div class='card' style='width: 18rem;padding:0; border:none'>" +
        `<h5 class="card-title">${this.typeInput.value}</h5>` +
        `<p class="card-text">${this.emailInput.value}</p>` +
        `<p class="card-text" style='font-weight:bold; font-style: italic'>CHƯA XỬ LÝ</p>` +
        "</div>";

      const response = await fetch("http://localhost:3456/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.adsId || null,
          coordinate: this.pos,
          typeReport: this.typeInput.value,
          email: this.emailInput.value,
          name: this.nameInput.value,
          phone: this.phoneInput.value,
          content: this.contentInput.value,
          imgs: imgsId,
          type: "issued",
        }),
      });

      const outcome = await response.json();
      this.map.pushReportMarker(outcome, "", content);
    });
  }

  resetFormFields() {
    this.modal.addEventListener("hidden.bs.modal", () => {
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

  async validateFile(files) {
    for await (const file of files) {
      const size = file.size / 1024 / 1024;
      if (size > 10) return false;
    }
    return true;
  }

  async verifyCaptcha() {
    const token = sessionStorage.getItem("captchaToken");
    sessionStorage.removeItem("captchaToken");
    const response = await fetch("/verify-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });

    const outcome = await response.json();
    return outcome.success;
  }

  validateForm() {
    const tmpThis = this;

    this.imgsInput.addEventListener("change", async function (e) {
      const files = e.currentTarget.files;

      const validateImgs = await tmpThis.validateFile(Array.from(files));

      if (!validateImgs || files.length > 2) {
        tmpThis.imgsInput.classList.add("is-invalid");
        tmpThis.submitBtn.setAttribute("disabled", "");
      } else {
        tmpThis.imgsInput.classList.contains("is-invalid") &&
          tmpThis.imgsInput.classList.remove("is-invalid");

        tmpThis.checkValid()
          ? (await tmpThis.verifyCaptcha()) &&
            tmpThis.submitBtn.removeAttribute("disabled")
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

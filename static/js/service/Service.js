export class Service {
  constructor(IMap) {
    this.map = IMap;
    this.infoWindow = new google.maps.InfoWindow();
  }

  moveToCurrentLocation() {
    const locationButton = document.createElement("button");
    locationButton.innerHTML = '<i class="bi bi-geo-alt"></i> Vị trí hiện tại';

    locationButton.classList.add("btn", "btn-outline-secondary", "otpBtn");

    this.map.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      locationButton
    );

    locationButton.addEventListener("click", async () => {
      try {
        const pos = await this.map.getCurrentLocation();
        this.map.currentLocation = pos;
        this.map.updateCurrentLoc(pos, "Bạn đang ở đây");
        this.map.map.setCenter(pos);
        this.map.map.setZoom(19);
      } catch (error) {
        this.handleLocationError(
          false,
          this.infoWindow,
          this.map.map.getCenter(),
          this.map.map
        );
      }
    });
  }

  showAllMarker() {
    const container = document.createElement("div");
    const toggleAds = document.createElement("div");
    const toggleReports = document.createElement("div");

    toggleAds.innerHTML = `
            <div class="form-check p-2 form-switch d-flex flex-row align-items-center" id="visibleAds">
                <input class="form-check-input p-2" type="checkbox" id="Ads" checked>
                <label class="form-check-label p-2" for="Ads">Bảng QC</label>
            </div>
        `;

    toggleReports.innerHTML = `
            <div class="form-check p-2 form-switch d-flex flex-row align-items-center" id="visibleReports">
                <input class="form-check-input p-2" type="checkbox" id="reports" checked>
                <label class="form-check-label p-2" for="reports">Báo cáo vi phạm</label>
            </div>
        `;

    container.classList.add(
      "d-flex",
      "container-toggle",
      "justify-content-end"
    );
    container.appendChild(toggleAds);
    container.appendChild(toggleReports);

    this.map.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
      container
    );

    toggleAds.addEventListener("change", (event) => {
      this.map.setMapOnAll(event.target.checked ? this.map.map : null);
      event.target.checked
        ? this.map.cluster.addMarkers(
            this.map.marker.map((marker) => marker.marker)
          )
        : this.map.cluster.clearMarkers();
    });
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos, map) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  preloadCaptcha() {
    // Use <div id="captcha"></div> to render captcha
    window.onload = () => {
      // Check if captcha element exists
      const captchaElement = document.querySelector("#captcha");
      if (captchaElement) {
        turnstile.render("#captcha", {
          sitekey: "0x4AAAAAAAOLF5GT_0tyAUJJ",
          theme: "auto",
          callback: (token) => {
            // Store token to session storage
            sessionStorage.setItem("captchaToken", token);
          },
        });
      }
    };
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
    console.log(outcome);
  }

  catchUserSelectedLocation() {
    this.map.map.addListener("click", async (event) => {
      // This modified func will allow to show only one userSelectedMarker
      this.map.updateSelectedMarker(event.latLng, "Vị trí bạn chọn");

      // Update banner
      this.map.banners.setBannersForUserSelection(
        await this.map.getDetailsFromCoordinate(event.latLng)
      );
      this.map.sideBar.setContent(1, this.map.banners.root);
      this.map.sideBar.show();
    });
  }

  clusterMarkers() {
    this.map.setCluster();
  }

  async saveImgs(files) {
    var res = [];
    const imgs = Array.from(files);

    for await (const file of imgs) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function () {
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

        const id = await response.json();
        console.log(id);
        res.push(id);
      };
    }

    return res;
  }

  catchUserSubmitReport() {
    const typeInput = document.getElementById("type");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const contentInput = document.getElementById("content");
    const imgsInput = document.getElementById("formFileMultiple");
    const submitBtn = document.querySelector('button[type="submit"]');

    imgsInput.addEventListener("change", function (e) {
      const files = e.currentTarget.files;

      if (files.length > 2) {
        imgsInput.classList.add("is-invalid");
        submitBtn.setAttribute("disabled", "");
      } else {
        imgsInput.classList.contains("is-invalid") &&
          imgsInput.classList.remove("is-invalid");
        submitBtn.removeAttribute("disabled");
      }
    });

    const tmpThis = this;

    document
      .querySelector("form#reportForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const files = document.querySelector("input#formFileMultiple").files;
        const imgs = await tmpThis.saveImgs(files);

        console.log(imgs);

        const response = await fetch("http://localhost:3456/report/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            typeReport: typeInput.value,
            email: emailInput.value,
            name: nameInput.value,
            phone: phoneInput.value,
            content: contentInput.value,
            imgs: imgs,
            type: "issued",
          }),
        });

        const outcome = await response.json();
        console.log(outcome);
      });
  }
}

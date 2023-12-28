export class Service {
	constructor(map) {
		this.map = map;
		this.infoWindow = new google.maps.InfoWindow();
	}

	moveToCurrentLocation() {
		const locationButton = document.createElement("button");
		locationButton.innerHTML = '<i class="bi bi-geo-alt"></i> Vị trí hiện tại';

		locationButton.classList.add("btn", "btn-outline-secondary", "otpBtn");

		this.map.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);

		locationButton.addEventListener("click", async () => {
			try {
				const pos = await this.map.getCurrentLocation();
				this.map.currentLocation = pos;
				this.map.updateCurrentLoc(pos, "Bạn đang ở đây");
				this.map.map.setCenter(pos);
				this.map.map.setZoom(19);
			} catch (error) {
				this.handleLocationError(false, this.infoWindow, this.map.map.getCenter(), this.map.map);
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

		container.classList.add("d-flex", "container-toggle", "justify-content-end");
		container.appendChild(toggleAds);
		container.appendChild(toggleReports);

		this.map.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(container);

		toggleAds.addEventListener("change", (event) => {
			event.target.checked ? this.map.setAdCluster() : this.map.removeAdCluster();
			this.map.setAdOnAll(event.target.checked);
		});

		toggleReports.addEventListener("change", (event) => {
			event.target.checked ? this.map.setReportCluster() : this.map.removeReportCluster();
			this.map.setReportOnAll(event.target.checked);
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
		return outcome.success;
	}
}

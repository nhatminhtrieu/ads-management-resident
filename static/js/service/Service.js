export class Service {
	constructor(IMap) {
		this.map = IMap;
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
			this.map.setMapOnAll(event.target.checked ? this.map.map : null);
			event.target.checked
				? this.map.cluster.addMarkers(this.map.marker.map((marker) => marker.marker))
				: this.map.cluster.clearMarkers();
		});

		toggleReports.addEventListener("change", (event) => {
			this.map.setReportOnAll(event.target.checked ? this.map.map : null);
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

	catchUserSelectedLocation(form) {
		this.map.map.addListener("click", async (event) => {
			// This modified func will allow to show only one userSelectedMarker
			this.map.updateSelectedMarker(event.latLng, "Vị trí bạn chọn");

			// Update card
			this.map.cards.setCardsForUserSelection(
				await this.map.getDetailsFromCoordinate(event.latLng)
			);
			this.map.sideBar.setContent(1, this.map.cards.root);
			this.map.sideBar.show();

			form.setPosition(event.latLng);
			form.setAdsId("");
		});
	}

	clusterMarkers() {
		this.map.setCluster();
	}

	catchUserClickMarker(form) {
		this.map.marker.forEach((marker) => {
			marker.addListener("click", () => {
				form.setPosition(marker.getPosition());
				form.setAdsId(marker.getAdsId());
			});
		});
	}

	async loadReportMarkers() {
		const tmpThis = this;
		try {
			const response = await fetch("http://localhost:3456/report/");
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const list = await response.json();
			for await (const report of list) {
				const contentString =
					"<div class='card' style='width: 18rem;padding:0; border:none'>" +
					`<h5 class="card-title">${report.typeReport}</h5>` +
					`<p class="card-text">${report.email}</p>` +
					`<p class="card-text" style='font-weight:bold; font-style: italic'>${
						report.type === "issued" ? "CHƯA XỬ LÝ" : "ĐÃ XỬ LÝ"
					}</p>` +
					"</div>";

				tmpThis.map.pushReportMarker(report, "", contentString);
			}
		} catch (error) {
			console.error(error);
		}
	}
}

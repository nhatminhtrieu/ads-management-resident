export class Service {
  constructor(IMap) {
    this.map = IMap;
    this.infoWindow = new google.maps.InfoWindow();
  }

  moveToCurrenLocation() {
    const locationButton = document.createElement("button");
    locationButton.innerHTML = '<i class="bi bi-geo-alt"></i> Vị trí hiện tại';

    locationButton.classList.add("btn", "btn-outline-secondary", "otpBtn");

    this.map.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      locationButton
    );

    locationButton.addEventListener("click", async () => {
      try {
        const pos = await this.map.getCurrentLocation();
        this.map.mark(pos, "Bạn đang ở đây");
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
            <div class="form-check form-switch d-flex flex-row align-items-center" id="visibleAds">
                <input class="form-check-input p-2" type="checkbox" id="Ads" checked>
                <label class="form-check-label p-2" for="Ads">Bảng QC</label>
            </div>
        `;

    toggleReports.innerHTML = `
            <div class="form-check form-switch d-flex flex-row align-items-center" id="visibleReports">
                <input class="form-check-input p-2" type="checkbox" id="reports" checked>
                <label class="form-check-label p-2" for="reports">Báo cáo vi phạm</label>
            </div>
        `;

    container.classList.add("d-flex", "container-toggle");
    container.appendChild(toggleAds);
    container.appendChild(toggleReports);

    this.map.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
      container
    );

    toggleAds.addEventListener("change", (event) => {
      this.map.setMapOnAll(event.target.checked ? this.map.map : null);
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
}

const visibleAdvertisements = (container, callback) => {
    const toggleSwitch = document.createElement('div');

    toggleSwitch.innerHTML = `
    <div class="form-check form-switch d-flex flex-row align-items-center" id="visibleAds">
        <input class="form-check-input p-2" type="checkbox" id="Ads">
        <label class="form-check-label p-2" for="Ads">Bảng QC</label>
    </div>
  `;

    container.appendChild(toggleSwitch);

    toggleSwitch.addEventListener('change', (event) => {
        callback(event.target.checked);
    });
}

const visibleReports = (container, callback) => {
    const toggleSwitch = document.createElement('div');

    toggleSwitch.innerHTML = `
    <div class="form-check form-switch d-flex flex-row align-items-center" id="visibleReports">
        <input class="form-check-input p-2" type="checkbox" id="reports">
        <label class="form-check-label p-2" for="reports">Báo cáo vi phạm</label>
    </div>
  `;
    container.appendChild(toggleSwitch);

    toggleSwitch.addEventListener('change', (event) => {
        callback(event.target.checked);
    });
}

export default function toggleContainer(map, callback){
    let switchAds = false, switchReports = false
    const container = document.createElement('div');

    container.classList.add('d-flex',  'container-toggle');
    
    visibleAdvertisements(container, (value) => {
        switchAds = value
        callback(switchAds, switchReports)
    });
    visibleReports(container, (value) => {
        switchReports = value
        callback(switchAds, switchReports)
    });

    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(container);
}
import { IMap } from "./map/Map.js";
import { Service } from "./map/MapService.js";
import Form from "./components/Form.js";
import SideBar from "./components/SideBar.js";
import DATABASE from "./dbConfig.js";

function contentAd(location) {
	const contentString =
		"<div class='card' style='width: 18rem;padding:0; border:none'>" +
		`<h5 class="card-title">${location.format.name}</h5>` +
		`<p class="card-text">${location.type}</p>` +
		`<p class="card-text">${location.address}</p>` +
		`<p class="card-text" style='font-weight:bold; font-style: italic'>${location.zoning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
		}</p>` +
		"</div>";
	return contentString;
}

function contentReport(report) {
	const contentString =
		"<div class='card' style='width: 18rem;padding:0; border:none'>" +
		`<h5 class="card-title">${report.typeReportName}</h5>` +
		`<p class="card-text">${report.email}</p>` +
		`<p class="card-text" style='font-weight:bold; font-style: italic'>${report.type === "Đã tiếp nhận" ? "Đã tiếp nhận" : "Đã xử lý"
		}</p>` +
		"</div>";
	return contentString;
}

async function loadAdMarkers(map) {
	try {
		const response = await fetch(`${DATABASE}/resident/location`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const list = await response.json();
		for await (const ad of list) {
			const contentString = contentAd(ad);
			map.pushAdMarker(ad, ad.address, contentString);
		}
	} catch (error) {
		console.error(error);
	}
}

async function loadReportMarkers(map) {
	try {
		const response = await fetch(`${DATABASE}/resident/report`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const list = await response.json();
		for await (const report of list) {
			const contentString = contentReport(report);
			map.pushReportMarker(report, report.typeReport, contentString);
		}
	} catch (error) {
		console.error(error);
	}
}

// toggle is false means the side bar is being hidden
async function main() {
	const map = new IMap();
	await map.init();

	const service = new Service(map);

	const sideBar = new SideBar();
	sideBar.init(map);

	service.preloadCaptcha();
	service.moveToCurrentLocation();
	service.showAllMarker();

	// Enable render ad markers function
	await loadAdMarkers(map);
	map.setAdCluster();
	// Enable render report markers function
	await loadReportMarkers(map);
	map.setReportCluster();

	const form = new Form(map);
	map.catchSelectedLocation();

	form.resetFormFields();
	const captcha = await service.verifyCaptcha();
	form.setCaptcha(captcha);
	form.catchUserSubmitReport();
}

main();

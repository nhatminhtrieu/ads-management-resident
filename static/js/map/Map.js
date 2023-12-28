import SideBar from "../components/SideBar.js";
import Description from "../components/Description.js";
import CustomMarker from "./Marker.js";
import GeoService from "./GeoService.js";

export class IMap {
	constructor() {
		this.map = null;
		this.adMarker = {
			markers: [],
			cluster: null,
		};
		this.reportMarker = {
			markers: [],
			cluster: null,
		};
		this.currentLocation = null;
		this.currentMarker = null;
		this.selectedMarker = null;
		this.infoWindow = null;
		this.sideBar = new SideBar();
		this.searchDes = new Description();
		this.locDes = new Description();
		this.reportDes = new Description();
		this.cluster = null;
		this.reportMarkers = [];
		this.returnData = null;
		this.handleChange = (_data) => {};
	}

	// Private variables
	#styledMapTypes = [
		{
			featureType: "transit.station",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
		{
			featureType: "poi",
			elementType: "labels.text",
			stylers: [{ visibility: "on" }],
		},
	];

	// Private methods

	#initCluster() {
		let markers = this.adMarker.markers.map((marker) => marker.marker);
		const map = this.map;
		this.adMarker.cluster = new markerClusterer.MarkerClusterer({ markers, map });

		markers = this.reportMarker.markers.map((marker) => marker.marker);
		this.reportMarker.cluster = new markerClusterer.MarkerClusterer({ markers, map });
	}

	#initSideBar() {
		this.sideBar.init();
		this.sideBar.initContent(1, () => {}, this.locDes.root);
		this.sideBar.initContent(2, () => {}, this.reportDes.root);
	}

	async init() {
		await google.maps.importLibrary("maps");
		const geolocation = new GeoService();
		this.currentLocation = await geolocation.getCurrentLocation();
		this.#initSideBar();

		this.infoWindow = new google.maps.InfoWindow();
		this.infoWindow.addListener("closeclick", () => {
			this.locDes.reset();
			this.reportDes.reset();
			this.sideBar.hide();
		});

		this.map = new google.maps.Map(document.getElementById("map"), {
			center: this.currentLocation,
			zoom: 16,
			mapId: "adf136d39bc00bf9",
			// Only use normal map type
			mapTypeControlOptions: {
				mapTypeIds: ["roadmap"],
			},
			mapTypeControl: false,
		});

		// Config styled map types
		const styledMapType = new google.maps.StyledMapType(this.#styledMapTypes);
		this.map.mapTypes.set("map", styledMapType);
		this.map.setMapTypeId("map");

		this.updateCurrentLoc(this.currentLocation);
		this.#initCluster();

		return this.map;
	}

	async pushAdMarker(location, title, content = title) {
		const marker = new CustomMarker(
			this.map,
			location.coordinate,
			title,
			location.zoning ? "zoning" : "not_zoning"
		);
		await marker.init();

		marker.addListener("click", () => {
			// Update and open info window
			this.infoWindow.setContent(content);
			this.infoWindow.open({
				anchor: marker.marker,
				map: this.map,
			});

			// Update side bar
			this.locDes.setCardsForAds(location.coordinate);
			this.sideBar.setActive(1);
			this.sideBar.show();
			this.selectedMarker && this.selectedMarker.setMap(null);
		});

		this.adMarker.markers.push(marker);
	}

	async pushReportMarker(report, title, content = title) {
		const marker = new CustomMarker(this.map, report.coordinate, title, report.type);
		await marker.init();

		marker.addListener("click", () => {
			// Update and open info window
			this.infoWindow.setContent(content);
			this.infoWindow.open({
				anchor: marker.marker,
				map: this.map,
			});

			// Update side bar
			this.reportDes.setCardsForReport(report);
			this.sideBar.setActive(2);
			this.sideBar.show();
			this.selectedMarker && this.selectedMarker.setMap(null);
		});
		this.reportMarker.markers.push(marker);
	}

	setAdCluster() {
		const markers = this.adMarker.markers.map((marker) => marker.marker);
		this.adMarker.cluster.addMarkers(markers);
	}

	setReportCluster() {
		const markers = this.reportMarker.markers.map((marker) => marker.marker);
		this.reportMarker.cluster.addMarkers(markers);
	}

	removeAdCluster() {
		const markers = this.reportMarker.markers.map((marker) => marker.marker);
		this.adMarker.cluster.clearMarkers(markers);
	}

	removeReportCluster() {
		const markers = this.reportMarker.markers.map((marker) => marker.marker);
		this.reportMarker.cluster.clearMarkers(markers);
	}

	updateCurrentLoc(position) {
		// Update position of the marker
		if (this.currentMarker) {
			this.currentMarker.setPosition(position);
		} else {
			const marker = new CustomMarker(this.map, position, "Bạn đang ở đây", "current");
			marker.init().then((result) => {
				// Set new marker
				this.currentMarker = result;
			});
		}
	}

	updateSelectedMarker(position) {
		// Clear old marker if exist
		if (this.selectedMarker) {
			this.selectedMarker.setMap(this.map);
			this.selectedMarker.setPosition(position);
			this.infoWindow.close();
		} else {
			const marker = new CustomMarker(this.map, position, "Vị trí bạn chọn", "select");
			marker.init().then(() => {
				// Set new marker
				this.selectedMarker = marker;
			});
		}
	}

	catchSelectedLocation() {
		this.map.addListener("click", async (event) => {
			// This modified func will allow to show only one userSelectedMarker
			this.updateSelectedMarker(event.latLng);

			// Update card
			const geolocation = new GeoService();
			this.locDes.setCardsForUserSelection(
				await geolocation.getDetailsFromCoordinate(event.latLng)
			);
			this.sideBar.setActive(1);
			this.sideBar.show();
		});
	}

	setAdOnAll(status) {
		this.adMarker.markers.forEach((marker) => marker.setMap(status ? this.map : null));
	}

	setReportOnAll(status) {
		this.reportMarker.markers.forEach((marker) => marker.setMap(status ? this.map : null));
	}
}

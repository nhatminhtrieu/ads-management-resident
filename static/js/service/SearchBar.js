export default class root {
	constructor() {
		this.searchBox = null;
		this.root = document.createElement("input");
		this.root.setAttribute("type", "text");
		this.root.setAttribute("placeholder", "Nhập địa chỉ...");
		this.root.classList.add("form-control", "border-2");
	}

	init(map) {
		this.searchBox = new google.maps.places.SearchBox(this.root);
		this.geoCoder = new google.maps.Geocoder();
		this.searchBox.addListener("places_changed", () => {
			const places = this.searchBox.getPlaces();
			if (places.length == 0) return;
			places.forEach((place) => {
				if (!place.geometry || !place.geometry.location) return;
				this.geoCoder.geocode({ address: place.formatted_address }, async (results, status) => {
					if (status == "OK") {
						const latLng = results[0].geometry.location;
						map.map.setCenter(latLng);
						map.updateSelectedMarker(latLng, place.formatted_address);

						// Update banner for the selected place
						map.cards.setCardsForUserSelection(await map.getDetailsFromCoordinate(latLng));
						map.sideBar.setContent(1, map.cards.root);

						return latLng;
					} else {
						console.log("Geocode was not successful for the following reason: " + status);
					}
				});
			});
		});
	}
}

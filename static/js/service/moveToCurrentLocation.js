function handleLocationError(browserHasGeolocation, infoWindow, pos, map) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
}

export default function currenLocation(map) {
    const locationButton = document.createElement("button");
    locationButton.innerHTML = '<i class="bi bi-geo-alt"></i> Vị trí hiện tại'

    locationButton.classList.add("btn", "btn-outline-secondary", "otpBtn");
    
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    
                    map.setCenter(pos);
                    map.setZoom(18);

                    const marker = new google.maps.Marker({
                        title: "Ban đang ở đây",
                        position: pos,
                        map: map,
                      });
                    
                      const infoWindow = new google.maps.InfoWindow({
                        content: "Bạn đang ở đây",
                      });

                      infoWindow.open(map, marker)
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter(), map);
                },
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter(), map);
        }
    });
}
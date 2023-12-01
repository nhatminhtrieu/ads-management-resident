export default async function initCurrentLocation() {
    const { Map } = await google.maps.importLibrary("maps");
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }, reject);
    });

    const map = new Map(document.getElementById("map"), {
        center: pos,
        zoom: 18,
    });

    const marker = new google.maps.Marker({
        title: "Ban đang ở đây",
        position: pos,
        map: map,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: "Bạn đang ở đây",
    });

    infoWindow.open(map, marker)

    return map
}
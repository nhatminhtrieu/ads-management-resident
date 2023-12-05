export class IMap {
    constructor() {
        this.map = null
        this.marker = []
        this.infoWindow = []
    }

    async initMap() {
        const { Map } = await google.maps.importLibrary("maps");
        const currenLocation = await this.getCurrentLocation();
        this.map = new Map(document.getElementById("map"), {
            center: currenLocation,
            zoom: 19,
        });

        this.mark(currenLocation, "Bạn đang ở đây")
        return this.map
    }

    async getCurrentLocation() {
        const pos = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) reject("Geolocation is not supported by your browser")

            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            }, reject)
        })
        return pos
    }

    mark(position, title, content = title) {
        const marker = new google.maps.Marker({
            position,
            map: this.map,
            title,
        })

        const infoWindow = new google.maps.InfoWindow({
            content
        });

        this.marker.push(marker)
        infoWindow.open(this.map, marker)
    }

    setMapOnAll(map) {
       this.marker.forEach(marker => marker.setMap(map))
    }
}
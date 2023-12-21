export default class SideBar {
  constructor() {
    this.sidebar = document.getElementById("side-bar");
    this.menu = document.getElementById("menu");
    this.tabs = Array.from(menu.children);
    this.description = document.getElementById("description");
    this.button = document.getElementById("collapse-btn");
    this.active = 0;
    this.visible = false;
    this.contents = [];
    this.defaultContent = document.createElement("div");
    this.searchButton = document.querySelector('.bi-search');
    this.searchBoxElement = document.createElement('input');
    this.searchBoxElement.setAttribute('type', 'text');
    this.searchBoxElement.setAttribute('placeholder', 'Enter an address...');
    this.defaultContent.style = `height: 100%;
    display: flex;
    justify-content: center;
    font-size: x-large;
    color: gray;
    align-items: center;`;
    this.searchBoxElement.style = `width: 100%;
    height: 30px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: small;`;
    this.defaultContent.innerHTML = "Chưa có thông tin";
  }

  init(map) {
    this.tabs[this.active].classList.add("tab-active");
    this.tabs.forEach((tab, id) => {
      this.contents.push(this.defaultContent);
      tab.onclick = () => {
        this.changeActive(id);
      };
    });
    this.description.innerHTML = "";
    this.description.appendChild(this.contents[this.active]);
    this.button.onclick = () => this.toggleVisible();
    this.searchBox = new google.maps.places.SearchBox(this.searchBoxElement);
    this.geoCoder = new google.maps.Geocoder();
    this.searchButton.addEventListener('click', () => {
      this.setContent(0, this.searchBoxElement);
      this.searchBox.addListener("places_changed", () => {
        const places = this.searchBox.getPlaces();
        if (places.length == 0) return;
        places.forEach(place => {
          if (!place.geometry || !place.geometry.location) return;
          this.geoCoder.geocode({ 'address': place.formatted_address }, async (results, status) => {
            if (status == 'OK') {
              const latLng = results[0].geometry.location;
              map.map.setCenter(latLng);
              map.updateSelectedMarker(latLng, place.formatted_address);

              // Update banner for the selected place
              map.banners.setBannersForUserSelection(
                await map.getDetailsFromCoordinate(latLng)
              );
              map.sideBar.setContent(1, map.banners.root);
              map.sideBar.show();

              return latLng;
            } else {
              console.log('Geocode was not successful for the following reason: ' + status);
            }
          });
        });
      });
    });
  }



  changeActive(index) {
    this.tabs[this.active].classList.remove("tab-active");
    this.tabs[index].classList.add("tab-active");
    this.active = index;
    this.description.innerHTML = "";
    this.description.appendChild(this.contents[index]);
  }

  show() {
    this.sidebar.style.width = "480px";
    this.button.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
  }

  hide() {
    this.sidebar.style.width = "0px";
    this.button.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
  }

  // Show/Hide the side bar
  toggleVisible() {
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
    this.visible = !this.visible;
  }

  // Reset content to default
  removeContent(index) {
    this.contents[index] = this.defaultContent;
    console.log("remove content");
    this.changeActive(index);
  }

  // Update content of a tab and change active to that tab
  setContent(index, content) {
    this.contents[index] = content;
    this.changeActive(index);
  }

  showCard(cardElement) {
    this.root.appendChild(cardElement);
  }
}
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
    this.defaultContent.style = `height: 100%;
    display: flex;
    justify-content: center;
    font-size: x-large;
    color: gray;
    align-items: center;`;
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
    this.initSearchBox(map);
  }

  // To do: red marker on input address
  initSearchBox(map) {
    const searchButton = document.querySelector('.bi-search');
    searchButton.addEventListener('click', () => {
      const searchBoxElement = document.createElement('input');
      searchBoxElement.type = 'text';
      searchBoxElement.placeholder = 'Enter an address...';
      this.setContent(0, searchBoxElement); // Use setContent to display search box

      // Apply Google Autocomplete to the search box
      const searchBox = new google.maps.places.SearchBox(searchBoxElement);

      // Create a new Geocoder
      const geocoder = new google.maps.Geocoder();

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // For each place, get the icon, name and location.
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }

          geocoder.geocode({ 'address': place.formatted_address }, async (results, status) => {
            if (status == 'OK') {
              const latLng = results[0].geometry.location;
              map.map.setCenter(latLng); // Set the map center to the input address

              // Show a marker at the input address
              map.updateSelectedMarker(latLng, place.formatted_address);

              return place; // return the formatted address
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
}

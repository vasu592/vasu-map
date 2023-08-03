/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example adds hide() and show() methods to a custom overlay's prototype.
// These methods toggle the visibility of the container <div>.
// overlay to or from the map.

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 19,
      center: { lat: 18.5314, lng: 73.870999 },
      mapTypeId: 'satellite',
    }
  );
  // new google.maps.Marker({
  //   position: { lat: 18.5314, lng: 73.870999 },
  //   map,
  //   title: 'Center',
  // });
  const bounds = new google.maps.LatLngBounds(
    //new google.maps.LatLng(62.281819, -150.287132),
    //new google.maps.LatLng(62.400471, -150.005608)
    new google.maps.LatLng(18.530864611080084, 73.87039111385027),
    new google.maps.LatLng(18.531782683389885, 73.8713674379317)

    // new google.maps.LatLng(18.531701985747137, 73.87053206061877),
    // new google.maps.LatLng(18.53109456918211, 73.87113337868803)
    //new google.maps.LatLng(50.88270, 7.09371),
    // new google.maps.LatLng(50.85180,7.17817)
  );
  new google.maps.Marker({
    position: { lat: 18.531782683389885, lng: 73.8713674379317 },
    map,
    title: 'South West',
  });
  new google.maps.Marker({
    position: { lat: 18.530864611080084, lng: 73.87039111385027 },
    map,
    title: 'North East',
  });

  // The photograph is courtesy of the U.S. Geological Survey.
  let image = '../images/ASTP_Revised_Floor_Plan.png';
console.log(image)
  /**
   * The custom USGSOverlay object contains the USGS image,
   * the bounds of the image, and a reference to the map.
   */
  class USGSOverlay extends google.maps.OverlayView {
    private bounds: google.maps.LatLngBounds;
    private image: string;
    private div?: HTMLElement;

    constructor(bounds: google.maps.LatLngBounds, image: string) {
      super();

      this.bounds = bounds;
      this.image = image;
    }

    /**
     * onAdd is called when the map's panes are ready and the overlay has been
     * added to the map.
     */
    onAdd() {
      this.div = document.createElement('div');
      this.div.style.borderStyle = 'none';
      this.div.style.borderWidth = '0px';
      this.div.style.position = 'absolute';

      // Create the img element and attach it to the div.
      const img = document.createElement('img');

      img.src = this.image;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.position = 'absolute';
      this.div.appendChild(img);

      // Add the element to the "overlayLayer" pane.
      const panes = this.getPanes()!;

      panes.overlayLayer.appendChild(this.div);
    }

    draw() {
      // We use the south-west and north-east
      // coordinates of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      const overlayProjection = this.getProjection();

      // Retrieve the south-west and north-east coordinates of this overlay
      // in LatLngs and convert them to pixel coordinates.
      // We'll use these coordinates to resize the div.
      const sw = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getSouthWest()
      )!;
      const ne = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getNorthEast()
      )!;

      // Resize the image's div to fit the indicated dimensions.
      if (this.div) {
        this.div.style.left = sw.x + 'px';
        this.div.style.top = ne.y + 'px';
        this.div.style.width = ne.x - sw.x + 'px';
        this.div.style.height = sw.y - ne.y + 'px';
      }
    }

    /**
     * The onRemove() method will be called automatically from the API if
     * we ever set the overlay's map property to 'null'.
     */
    onRemove() {
      if (this.div) {
        (this.div.parentNode as HTMLElement).removeChild(this.div);
        delete this.div;
      }
    }

    /**
     *  Set the visibility to 'hidden' or 'visible'.
     */
    hide() {
      if (this.div) {
        this.div.style.visibility = 'hidden';
      }
    }

    show() {
      if (this.div) {
        this.div.style.visibility = 'visible';
      }
    }

    toggle() {
      if (this.div) {
        if (this.div.style.visibility === 'hidden') {
          this.show();
        } else {
          this.hide();
        }
      }
    }

    toggleDOM(map: google.maps.Map) {
      if (this.getMap()) {
        this.setMap(null);
      } else {
        this.setMap(map);
      }
    }
  }

  const overlay: USGSOverlay = new USGSOverlay(bounds, image);

  overlay.setMap(map);

  const toggleButton = document.createElement('button');

  toggleButton.textContent = 'Toggle';
  toggleButton.classList.add('custom-map-control-button');

  const toggleDOMButton = document.createElement('button');

  toggleDOMButton.textContent = 'Toggle DOM Attachment';
  toggleDOMButton.classList.add('custom-map-control-button');

  toggleButton.addEventListener('click', () => {
    overlay.toggle();
  });

  toggleDOMButton.addEventListener('click', () => {
    overlay.toggleDOM(map);
  });

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleButton);

  google.maps.event.addListener(map, 'click', function (event) {
    console.log('x and y values', event.pixel.x, event.pixel.y);

    var data = [
      { x: 439, y: 472 },
      { x: 466.4995532295124, y: 467.1755169772785 },
      { x: 492.4697674418605, y: 437.5953488372093 },
      { x: 415.46644331568143, y: 311.47119853020644 },
      { x: 289.7771671246565, y: 214.93180114913815 },
      { x: 205.09169455904103, y: 68.77629018447888 },
    ];
    for (var i = 0; i < data.length; i++) {
      var pixelLatLng = overlay
        .getProjection()
        .fromContainerPixelToLatLng(
          new google.maps.Point(data[i].x, data[i].y)
        );

      // if (pixelLatLng) {
      //   new google.maps.Marker({
      //     position: { lat: pixelLatLng.lat(), lng: pixelLatLng.lng() },
      //     map,
      //     title: 'Hello World!',
      //   });
      // }
    }
    var pixelLatLng1 = overlay
      .getProjection()
      .fromContainerPixelToLatLng(
        new google.maps.Point(event.pixel.x, event.pixel.y)
      );
    if (pixelLatLng1) {
      new google.maps.Marker({
        position: { lat: pixelLatLng1.lat(), lng: pixelLatLng1.lng() },
        map,
        title: 'Hello World!',
      });
    }
    var msg1 =
      ': Container setting marker at Lat: ' +
      pixelLatLng1.lat() +
      ', Lng: ' +
      pixelLatLng1.lng();
    console.log(msg1);
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};

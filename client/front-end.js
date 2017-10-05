$(function() {
  initMap();

  navToUserGeoLocation();

  initSocketConnection();
});

function navToUserGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.navToUserPosition);
  } else {
    this.navToInitialPosition();
  }
}

function initSocketConnection() {

  this.socketId = null;

  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  this.socket = new WebSocket(`ws://warm-sands-41066.herokuapp.com/`);

  this.socket.onopen = function() {
    // socket is opened and ready to use
  };

  this.socket.onerror = function(error) {
    // an error occurred when sending/receiving data
  };

  // handle incoming message
  this.socket.onmessage = message => {
    if (!JSON.parse(message.data)) {
      return;
    }

    var oMessage = JSON.parse(message.data);

    if (oMessage.id) {
      setSocketId(this.socketId || oMessage.id);
    }

    if (oMessage.lat && oMessage.lng) {
      let oMarker = L.marker([oMessage.lat, oMessage.lng], {
        title: oMessage.name
      }).addTo(this.map);

      oMarker.bindPopup(`<b>${oMessage.name || oMessage.id}</b>`).openPopup();
    }
  };
}

function initMap() {
  this.map = L.map('mapid').setView([51.505, -0.09], 3);

  const accessToken =
    'pk.eyJ1IjoianVsaW9yZW5uZXIiLCJhIjoiY2o3YzNxODc2MTBuOTJxcDMyZDcyZGt5cyJ9.dGwfzwhONgibD6L2nxA0Ww';
  L.tileLayer(
    `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}`,
    {
      maxZoom: 20,
      minZoom: 3,
      id: 'mapbox.streets',
      accessToken: accessToken
    }
  ).addTo(this.map);
}

function navToUserPosition(position) {
  position && position.coords
    ? flyToPosition(position.coords, 14)
    : navToInitialPosition();
}

function flyToPosition(coordinates, zoomLevel) {
  this.map.flyTo(
    { lat: coordinates.latitude, lon: coordinates.longitude },
    zoomLevel
  );
}

function navToInitialPosition() {
  let defaultCoords = {
    latitude: '-29.68417',
    longitude: '-53.80694'
  };

  flyToPosition(defaultCoords, 6);
}

function messageFactory(id, lat, lng, name) {
  return {
    id: id,
    lat: lat,
    lng: lng,
    name: name
  };
}

function setSocketId(id) {
  if (this.socketId !== id) {
    this.socketId = id;
    addMapClick();
  }
}

function addMapClick() {
  this.map.on('click', e => {
    var message = this.messageFactory(
      this.socketId,
      e.latlng.lat,
      e.latlng.lng,
      $('#input')[0].value || ''
    );
    this.socket.send(JSON.stringify(message));
  });
}

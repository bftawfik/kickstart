var map;
var service;
var infowindow;
var requests = [
  {
    query: 'Damascus',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Mogadishu',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Ibiza',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Tahrir',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Nairobi',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Kathmandu',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Bernabau',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Athens',
    fields: ['name', 'geometry'],
  },
  {
    query: 'Istanbul',
    fields: ['name', 'geometry'],
  }
];

function initMap() {
  var cairo = new google.maps.LatLng(30.0595581,31.2234449);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(
      document.getElementById('map'), {center: cairo, zoom: 5});

  service = new google.maps.places.PlacesService(map);

  requests.map(request => {
    service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }

        // map.setCenter(results[0].geometry.location);
      }
    });
  })
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

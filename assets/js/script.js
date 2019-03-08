console.log("script");
//---------------------------------------------------------------
var map;
var service;
var infowindow;
var requests = [
  {
    query: 'Damascus',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Mogadishu',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Ibiza',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Tahrir',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Nairobi',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Kathmandu',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Bernabau',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Athens',
    fields: ['name', 'geometry', 'types'],
  },
  {
    query: 'Istanbul',
    fields: ['name', 'geometry', 'types'],
  }
];

function initMap() {
  console.log("initMap");
  var cairo = new google.maps.LatLng(30.0595581,31.2234449);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(
      document.getElementById('map'), {center: cairo, zoom: 5});

  service = new google.maps.places.PlacesService(map);

}

function changeRequests(newRequests){
  console.log("changeRequests");
  // console.log(newRequests);
  requests = newRequests.map(r => ({query: r, fields: ['name', 'geometry', 'types']}));
  createMarkers();
}

function createMarkers(){
  requests.map(request => {
    service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // console.log(results[0].name, results[0].types);
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

//---------------------------------------------------------------




let demoApp = angular.module("demoApp", [])
.factory('SimpleFactory', ($http, $templateCache) => {

  let factory = {};

  let httpConfig = {
    method: 'GET',
    url: 'https://spreadsheets.google.com/feeds/list/0Ai2EnLApq68edEVRNU0xdW9QX1BqQXhHRl9sWDNfQXc/od6/public/basic?alt=json',
    cache: $templateCache
  };

  factory.fetch = () => {
    return $http(httpConfig);
  };

  return factory;
})
.controller('SimpleController', ($scope, SimpleFactory) => {
  let code = '!!';
  let msg = 'Loading...';
  $scope.status = code;
  $scope.data = msg;

  SimpleFactory.fetch()
  .then(
    (successResp) => {
      $scope.status = successResp.status;
      $scope.data = successResp.data;

      $scope.entry = successResp.data.feed.entry;
      $scope.content = $scope.entry.map(e => {
        let o = {};
        let s1 = e.content.$t.split(": ");
        o[s1[0]] = s1[1].split(", ")[0];
        o[s1[1].split(", ")[1]] = s1[2].slice(0, s1[2].lastIndexOf(","));
        o[s1[2].slice(s1[2].lastIndexOf(",")+2, s1[2].length)] = s1[3];
        let country = s1[2].slice(0, s1[2].lastIndexOf(",")).split(",").join("").split(" ").filter(w => w.length && w[0].toUpperCase() === w[0]);
        // console.log(o);
        return o;
      });
      let messagesData = $scope.content.map(data => data.message.split("! "));
      messagesData = messagesData.map(mData => {
        return mData.map(dataLine => {
          let dlCaps = dataLine.match(/[A-Z][a-z]*/gm);
          dlCaps = dlCaps.length > 1 ? dlCaps.slice(1, 2) : dlCaps;
          return dlCaps;
        })
      });
      $scope.messagesData = messagesData.map(mData => mData.length > 1 ? mData.slice(1, 2)[0][0]: mData[0][0]);
      // $scope.countries = $scope.countries.map(c => c.split("! "));
      // $scope.countries = $scope.countries.map(c => ({data: c.match(/[A-Z][a-z]*/gm), filtered: false}));
      // // $scope.countries = $scope.countries.map(c => c.data.length===1 ? Object.assign({}, c, {filtered: true}) : Object.assign({}, c, {data: c.data.slice(1,c.data.length)}));
      // $scope.countries = $scope.countries.map(c => c.data.length === 2 ? Object.assign({}, c, {data: c.data.slice(1,c.data.length)}, {filtered: true}) : c.data.length === 1 ? Object.assign({}, c, {filtered: true}) : Object.assign({}, c, {data: c.data.slice(1,c.data.length)}));
      console.log($scope.messagesData);
      changeRequests([...$scope.messagesData]);
      // createMarkers();
      // $scope.msgs = $scope.content.map(data => data.split(', ').reduce((acc, item) =>  {acc[item.split(':')[0]] = item.split(':')[1]; return acc}, {}));
      // $scope.messages = $scope.msgs.map(msg => msg.message.split(" ").filter(w => w.length && w[0].toUpperCase() === w[0]).filter((e,i,a) => a.length-1 === i));
      // $scope.messages = $scope.msgs.map(msg => msg.message.split(" "));
      // console.log($scope.content);
    },
    (errorResp) => {
      // console.log(errorResp)
      $scope.status = errorResp.status;
      $scope.data = errorResp.data || 'Request failed';
    }
  );
});

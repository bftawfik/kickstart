console.log("script");

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
      $scope.content = $scope.entry.map(e => e.content.$t);
      $scope.content = $scope.content.map(data => {
        let o = {};
        let s1 = data.split(": ");
        o[s1[0]] = s1[1].split(", ")[0];
        o[s1[1].split(", ")[1]] = s1[2].slice(0, s1[2].lastIndexOf(","));
        o[s1[2].slice(s1[2].lastIndexOf(",")+2, s1[2].length)] = s1[3];
        let country = s1[2].slice(0, s1[2].lastIndexOf(",")).split(",").join("").split(" ").filter(w => w.length && w[0].toUpperCase() === w[0]);
        console.log(country);
        console.log(s1[2].slice(0, s1[2].lastIndexOf(",")));
        return o;
      });
      // console.log($scope.content);
      $scope.msgs = $scope.content.map(data => data.message);
      console.log($scope.msgs);
      // $scope.msgs = $scope.content.map(data => data.split(', ').reduce((acc, item) =>  {acc[item.split(':')[0]] = item.split(':')[1]; return acc}, {}));
      // $scope.messages = $scope.msgs.map(msg => msg.message.split(" ").filter(w => w.length && w[0].toUpperCase() === w[0]).filter((e,i,a) => a.length-1 === i));
      // $scope.messages = $scope.msgs.map(msg => msg.message.split(" "));
      // console.log($scope.content);
    },
    (errorResp) => {
      console.log(errorResp)
      $scope.status = errorResp.status;
      $scope.data = errorResp.data || 'Request failed';
    }
  );
});


var groupListController = function groupListController($scope, abData) {

  $scope.groups = [];
  $scope.groupsLoaded = false;
  abData.getGroups().then(function (groups) {
    $scope.groups = groups;
    $scope.groupsLoaded = true;
  });

  $scope.newGroup = {
    'name': ''
  };

  $scope.orderPredicate = 'name';

  $scope.groupExists = function groupExists() {
    return $scope.groups.length > 0 && $scope.groups.indexOf($scope.newGroup.name) >= 0;
  }

  $scope.addGroup = function addGroup() {
    /*
    Adds a new group to the address book
    */
    var groupName = $scope.newGroup.name;
    abData.addGroup(groupName).then(function (response) {
      $scope.groups.push(groupName);
    });
    $scope.newGroup.name = '';
  }

  $scope.deleteGroup = function removeGroup(group) {
    /*
    Removes a group from the addressbook, including any links with contacts
    */
    abData.deleteGroup(group).then(function (response) {
      var idx = $scope.groups.indexOf(group);
      $scope.groups.splice(idx, 1);
    });
    abData.contactsUpdated = false;
  }

}

abApp.controller(
  'groupListController',
  ['$scope', 'addressBookDataService', groupListController]
);
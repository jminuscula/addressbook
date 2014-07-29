
var addContactController = function addContactController($scope, abData) {

  $scope.contact = {
    'name': '',
    'lastname': '',
    'phone': '',
    'email': '',
    'address': ''
  }

  $scope.alerts = [];

  $scope.addContact = function addContact() {
    var name = $scope.contact.name;
    abData.addContact($scope.contact).then(function addedContact(res) {
      var success_msg = 'was added to the database',
          error_msg = 'could not be added to the database',
          success = (res.inserted !== undefined),
          msg = success ? success_msg : error_msg;
      $scope.alerts.unshift({'name': name, 'success': success, 'msg': msg});
      abData.contactsUpdated = false;
    });
    $('form')[0].reset();
  }

}

abApp.controller(
  'addContactController',
  ['$scope', 'addressBookDataService', addContactController]
);
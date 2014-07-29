
var contactDirective = function contactDirective() {
  return {
    'scope': {
      'contact': '=data',
      'active': '=active',
      'display': '=display',
      'collapse': '=collapse',
      'delete': '=delete',
      'remove': '=remove',
      'addgroup': '=addgroup'
    },
    'restrict': 'E',
    'replace': 'true',
    'templateUrl': '/addressbook-contact-list/contact.html'
  }
}

abApp.directive('contact', contactDirective);


var contactListController = function contactListController($scope, abData) {
  /*
  Handles the list of contacts and contact interactions
  */

  $scope.contactsLoaded = false;
  abData.getContacts().then(function (contacts) {
    $scope.contacts = contacts;
    $scope.contactsLoaded = true;
  });

  abData.getGroups().then(function (groups) {
    $scope.groups = groups;
  });

  $scope.activeContact = null;
  $scope.selectedGroups = [];

  $scope.search = {
    'contactQuery': ''
  };

  $scope.contactSearch = function contactSearch() {
    return function(item) {
      var term = $scope.search.contactQuery.toLowerCase(),
          searchBy = [item.name, item.lastname].concat(item.groups);

      for (var i = 0; i < searchBy.length; i++) {
        if (searchBy[i] && searchBy[i].toLowerCase().indexOf(term) == 0) {
          return true;
        }
      }

      // deselect item if doesn't match search
      $scope.activeContact = ($scope.activeContact === item) ? null : item;
    }
  }

  $scope.displayContact = function displayContact(contact) {
    /*
    Shows contact details
    */
    $scope.activeContact = contact;
  }

  $scope.collapseContacts = function collapseContact() {
    /*
    Hides contact details
    */
    $scope.activeContact = null;
    $scope.selectedGroups = [];
  }

  $scope.deleteContact = function deleteContact(contact) {
    /*
    Deletes the contact from the database
    */
    abData.deleteContact(contact).then(function(response) {
      var idx;
      if (response.deleted == 1){
        idx = $scope.contacts.indexOf(contact);
        $scope.contacts.splice(idx, 1);
      }
    });
  }

  $scope.removeFromGroup = function removeFromGroup(contact, group) {
    /*
    Removes the selected group for the contact
    */
    contact.removeGroup(group);
    abData.updateContact(contact);
  }

  $scope.activeContactRemainingGroups = function activeContactRemainingGroups() {
    /*
    Lists all defined groups which activeContact is not a member of
    */
    if (!$scope.activeContact) {
      return false;
    }

    var cgroups = [];
    angular.forEach($scope.groups, function(group) {
      if ($scope.activeContact.groups.indexOf(group) == -1) {
        cgroups.push(group);
      }
    });
    return cgroups;
  }

  $scope.toggleSelectGroup = function toggleSelectGroup(group) {
    /*
    Handles UI group selection
    */
    var gidx = $scope.selectedGroups.indexOf(group);
    if (gidx >= 0) {
      $scope.selectedGroups.splice(gidx, 1);
    } else {
      $scope.selectedGroups.push(group);
    }
  }

  $scope.isGroupSelected = function isGroupSelected(group) {
    /*
    Handles UI group filter
    */
    return ($scope.selectedGroups.indexOf(group) >= 0);
  }

  $scope.cancelSelectGroups = function cancelSelectGroups() {
    /*
    Handles UI dismiss group selection
    */
    $scope.selectedGroups = [];
  }

  $scope.addActiveContactToGroups = function addActiveContactToGroups() {
    /*
    Adds all selected groups to the activeContact
    */
    for (var i in $scope.selectedGroups) {
      $scope.activeContact.addGroup($scope.selectedGroups[i]);
    }
    abData.updateContact($scope.activeContact);
    $scope.selectedGroups = [];
  }

}

abApp.controller(
  'contactListController',
  ['$scope', 'addressBookDataService', contactListController]
);

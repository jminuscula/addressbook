var abApp = angular.module('abApp', ['ui.router', 'ngResource']);

abApp.config(['$stateProvider',
  function abAppConfig($stateProvider) {

    $stateProvider
      .state('contacts', {
        url: '/contacts',
        templateUrl: 'addressbook-contact-list/list.html',
        controller: 'contactListController'
      })
      .state('addcontact', {
        url: '/contacts/add',
        templateUrl: 'addressbook-contact-add/add.html',
        controller: 'addContactController'
      })
      .state('groups', {
        url: '/groups',
        templateUrl: 'addressbook-group/list.html',
        controller: 'groupListController'
      });

  }
]);

abApp.run(['$state', function abAppRun($state) {
  $state.go('contacts');
}]);

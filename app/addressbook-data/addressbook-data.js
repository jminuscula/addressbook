
abApp.service('addressBookDataService', ['$resource', '$q',

  function addressBookDataService($resource, $q) {
    /*
    Main service for our application data.
    Synchronizes the contact list and groups.
    */
    var service = this,
        contactResource = $resource('http://127.0.0.1:8081/api/contact/:id'),
        groupResource = $resource('http://127.0.0.1:8081/api/group/:name');

    this.contacts = [];
    this.contactsUpdated = false;
    this.groups = [];

    this.getContacts = function getContacts() {
      /*
      Returns a promise for the contacts, which resolves to the cached
      content or queries the contacts resource.
      */
      var deferred = $q.defer();

      if (this.contactsUpdated) {
        deferred.resolve(this.contacts);
      } else {
        contactResource.query(function (response) {
          service.contacts = [];
          angular.forEach(response, function(data) {
            service.contacts.push(new Contact(data));
          });
          service.contactsUpdated = true;
          deferred.resolve(service.contacts);
        });
      };

      return deferred.promise;
    }

    this.deleteContact = function removeContact(contact) {
      /*
      Deletes a contact from the database and removes it from the list
      @param contact: the Contact object to be deleted.
      */
      var deferred = $q.defer();
      contactResource.delete({ id: contact.id }, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    this.updateContact = function updateContact(contact) {
      /*
      Updates the database with the provided contact information
      @param contact: the Contact object to be updated.
      */
      var deferred = $q.defer();
      contactResource.save({ id: contact.id }, contact.getData(), function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    this.addContact = function addContact(data) {
      /*
      Inserts a new contact into the database
      @param data: object containing contact data
      */
      var deferred = $q.defer();
      contactResource.save({ id: 'new' }, data, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    this.getGroups = function getGroups() {
      /*
      Returns a promise for the groups, which resolves to the cached
      content or queries the groups resource.
      */
      var deferred = $q.defer();

      if (this.groups.length) {
        deferred.resolve(this.groups);
      } else {
        groupResource.query(function (response) {
          angular.forEach(response, function(data) {
            service.groups.push(data.name);
          });
          deferred.resolve(service.groups);
        });
      };

      return deferred.promise;
    };

    this.addGroup = function addGroup(groupName) {
      /*
      Inserts a new group into the database
      @params groupName: the group name
      */
      var deferred = $q.defer(),
          data = {'_type': 'group', 'name': groupName};

      groupResource.save({ 'name': 'new' }, data, function(response) {
        deferred.resolve(response);
      });

      return deferred.promise;
    };

    this.deleteGroup = function deleteGroup(groupName) {
      /*
      Deletes a group
      @params groupName: the group name to be deleted
      */
      var deferred = $q.defer();
      groupResource.delete({ 'name': groupName }, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

  }
]);

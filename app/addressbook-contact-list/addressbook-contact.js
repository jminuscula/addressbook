
function Contact(data){
  var contact = this;

  this.id = data._id;
  this.name = data.name;
  this.lastname = data.lastname;
  this.phone = data.phone
  this.email = data.email;
  this.address = data.address;
  this.groups = data.groups || [];

  this.orderPredicate = function orderPredicate() {
    return this.lastname + this.name;
  }

  this.displayName = function displayName() {
    return this.lastname + ", " + this.name;
  }

  this.removeGroup = function removeGroup(group) {
    var idx = contact.groups.indexOf(group);
    if (idx >= 0) {
      return contact.groups.splice(idx, 1);
    }
    return false;
  }

  this.addGroup = function addGroup(group) {
    return contact.groups.push(group);
  }

  this.getData = function getData(){
    var data = {};
    for (var key in contact) {
      if (typeof contact[key] !== 'function') {
        data[key] = contact[key];
      }
    }
    return data;
  }

}

/*

Simple Addressbook API
----------------------
Stores contacts and groups information in a light NeDB database and
exposes a REST API to manage them.

*/

// basic config
var ServerConfig = {
  'port': 8081
};


// web server
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    api = express.Router(),
    server = app.listen(ServerConfig.port);

// database
var Datastore = require('nedb'),
    db = new Datastore({ filename: 'database', autoload: true });

// disable CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,PATCH,POST,DELETE");
  next();
});

// enalbe POST data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*
Get full list of contacts without details
*/
api.get('/contact', function(req, res) {
  db.find({ '_type': 'contact' }, function dbFindAllContacts(err, docs) {
    res.json(docs);
  });
});

/*
Add new contact
*/
api.post('/contact/new', function(req, res) {
  var data = req.body;
  data._type = 'contact';
  db.insert(data, function dbInsertContact(err, nInserted) {
    res.json({ 'inserted': nInserted });
  });
})

/*
Get full details of a contact
@param id: id of the contact as provided by /contacts
*/
api.get('/contact/:id', function(req, res) {
  db.find({ '_id': req.params.id }, function dbFindContactById(err, docs) {
    if (docs.length){
      return res.json(docs[0]);
    }
    res.status(404);
  });
});

/*
Remove contact
@param id: id of the contact as provided by /contacts
*/
api.delete('/contact/:id', function(req, res) {
  db.remove({ '_id': req.params.id },
    function dbRemoveContactById(err, nRemoved) {
      res.json({ 'deleted': nRemoved });
    });
});

/*
Update contact
@param id: id of the contact as provided by /contacts
*/
api.post('/contact/:id', function(req, res) {
  db.update({ '_id': req.params.id }, { $set: req.body },
    function dbUpdateContactById(err, nReplaced) {
      res.json({ 'updated': nReplaced });
    });
})

/*
Get full list of groups
*/
api.get('/group', function(req, res) {
  db.find({ '_type': 'group' }, function dbFindAllContacts(err, docs) {
    res.json(docs);
  });
});

/*
Add new group
*/
api.post('/group/new', function(req, res) {
  var data = req.body;
  data._type = 'group';
  db.insert(data, function dbInsertGroup(err, nInserted) {
    res.json({ 'inserted': nInserted });
  });
});

/*
Delete group
@param name: name of the group to be deleted
*/

api.delete('/group/:name', function(req, res) {
  var groupName = req.params.name,
      resData = {};

  db.remove({ '_type': 'group', 'name': groupName},
  function dbRemoveGroup(err, nRemoved) {
    resData.removed = nRemoved;

    var contactQuery = {'_type': 'contact', 'groups' : { $exists: true } };
    db.update(contactQuery, { $pull: { 'groups': groupName } }, { multi: true }, 
    function dbRemoveContactGroups(err, nContactsRemoved) {
      resData.contactsRemoved = nContactsRemoved;
      res.json(resData);
    });
  });
});

app.use('/api', api);
module.exports = app;

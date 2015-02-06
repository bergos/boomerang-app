'use strict';

require('rdf-jsonify')(rdf);


var App = function (store, base, options) {
  var
    self = this,
    client = new rdf.JSONify(store),
    ns = 'https://ns.bergnet.org/boomerang#',
    context = {'@vocab': ns};

  if (options == null) {
    options = {};
  }

  if (!('dataPath' in options)) {
    options.dataPath = base + 'data/';
  }

  if (!('filePath' in options)) {
    options.filePath = base + 'files/';
  }

  if (!('taskListIri' in options)) {
    options.taskListIri = options.dataPath + 'tasks#list';
  }

  var propertyToArray = function (obj, property) {
    if (obj == null || !(property in obj)) {
      return [];
    }

    return Array.isArray(obj[property]) ? obj[property] : [obj[property]];
  };

  this.clean = function () {
    var deleteGraphs = [];

    return client.get(options.taskListIri, context)
      .then(function (taskList) { console.log(taskList);
        propertyToArray(taskList, 'hasTask').forEach(function (task) {
          deleteGraphs.push(client.delete(task['@id']));
        });

        deleteGraphs.push(client.delete(options.taskListIri));

        return Promise.all(deleteGraphs);
      });
  };

  this.deployTask = function (task) {
    var item = {
      '@context': context,
      '@id': options.taskListIri,
      'hasTask': {
        '@id': task['@id']
      }
    };

    return Promise.all([
      client.put(task),
      client.patch(item)
    ]).then(function () {
      console.log('added task <' + task['@id'] + '> to list <' + item['@id'] + '>');

      return task;
    });
  };

  this.buildTask = function (id, application, dependencies, parameters) {
    return {
      '@context': context,
      '@id': options.dataPath + id,
      'application': {
        "@id": options.filePath + application
      },
      'dependency': dependencies.map(function (dependency) {
        return {'@id': options.filePath + dependency};
      }),
      'parameters': parameters,
      'status': {'@id': ns + 'created'}
    };
  };

  this.createTask = function (id, application, dependencies, parameters) {
    return self.deployTask(self.buildTask(id, application, dependencies, parameters));
  };

  this.runTask = function (id, application, dependencies, parameters) {
    var task = self.buildTask(id, application, dependencies, parameters);

    return self.deployTask(task)
      .then(function (task) {
        return new Promise(function (resolve, reject) {
          var getTask = function () {
            return client.get(task['@id'], context)
              .then(function (currentTask) {
                return currentTask;
              });
          };

          var checkStatus = function () {
            getTask()
              .then(function (updatedTask) {
                if (updatedTask.status['@id'] === ns + 'finished') {
                  resolve(updatedTask.result);
                } else {
                  setTimeout(checkStatus, 1000);
                }
              });
          };

          checkStatus();
        });
      });
  }
};


module.exports = App;
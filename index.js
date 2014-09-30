// Requires
var Q = require('q');
var _ = require('underscore');

var qClass = require('qpatch').qClass;

// Etcd client
var Etcd = qClass(require('node-etcd'), ['watcher']);


// Since etcd create the dir keys automatically
// transform the tree of keys
// to contain only a flat array of leaves
function normalize(obj) {
    obj = obj.node || obj;
    // Is a leaf
    if(!_.has(obj, 'nodes')) {
        // We don't want the modifiedIndex attr in our dumps/restores
        return _.pick(obj, 'key', 'value');
    }
    return _.flatten(_.map(obj.nodes, normalize));
}


function Dumper(host, port) {
    // ETCD client
    this.store = new Etcd(host, port);

    _.bindAll(this);
}

// Get a JS object of the DB
Dumper.prototype.dump = function() {
    return this.store.get('', {
        recursive: true
    })
    .then(normalize);
};

// Restore a list of keys
Dumper.prototype.restore = function(entries) {
    var self = this;

    return Q.all(_.map(entries, function(entry) {
        return self.store.set(entry.key, entry.value);
    }));
};

// Restore the database from input data
function createDumper(host, port) {
    return new Dumper(host, port);
}

// Exports
module.exports = createDumper;
module.exports.normalize = normalize;

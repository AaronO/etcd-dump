// Requires
var Q = require('q');
var _ = require('underscore');

var qClass = require('qpatch').qClass;

// Etcd client
var Etcd = qClass(require('node-etcd'), ['watcher']);


// Since etcd create the dir keys automatically
// transform the tree of keys
// to contain only a flat array of leaves
function cleanDump(obj) {
    // Is a leaf
    if(!_.has(obj, 'kvs')) {
        // We don't want the modifiedIndex attr in our dumps/restores
        return _.pick(obj, 'key', 'value');
    }
    return _.flatten(_.map(obj.kvs, cleanDump));
}


function Dumper(etcd) {
    // ETCD client
    this.store = new Etcd();

    _.bindAll(this);
}

// Get a JS object of the DB
Dumper.prototype.dump = function() {
    return this.store.get('', {
        recursive: true
    })
    .then(cleanDump);
};

// Restore a list of keys
Dumper.prototype.restore = function(entries) {
    var self = this;

    return Q.all(_.map(entries, function(entry) {
        return this.store.set(entry.key, entry.value);
    }));
};

// Restore the database from input data
function createDumper() {
    return new Dumper();
}

// Exports
module.exports = createDumper;

#!/usr/bin/env node

// Requires
var _ = require('underscore');

var fs = require('fs');

// Comannder
var prog = require('commander');

// etcd-dump's package.json file
var pkg = require('../package.json');

// General options
prog
.version(pkg.version)
.option('-f, --file [json_file]', 'Path to JSON dump file for dumping/storing', './etcd_dump.json')
.option('-h, --host [127.0.0.1]', 'etcd host', '127.0.0.1')
.option('-p, --port [4001]', 'etcd port', '4001')
.option('--ca-file [/path/to/ca-file]', 'Path to CA file for SSL support', '')
.option('--cert-file [/path/to/cert-file]', 'Path to cert file for SSL support', '')
.option('--key-file [/path/to/key-file]', 'Path to key file for SSL support', '')
.option('--reject-unauthorized [true]', 'Reject unauthorized SSL certificates?', 'true')
.parse(process.argv);

var sslOptions = {};
['caFile', 'certFile', 'keyFile'].forEach(function(key){
	if (prog[key]) {
		sslOptions[key.replace("File", "")] = fs.readFileSync(prog[key]);
	}
});

if (Object.keys(sslOptions).length > 0) {
	sslOptions.rejectUnauthorized = prog.rejectUnauthorized === 'false' ? false : true;
}

// Dumper class
var dumper = require('../')(prog.host, prog.port, sslOptions);

// Dump command
prog
.command('dump')
.action(function() {
    return dumper.dump()
    .then(function(data) {
        // Write file to disk
        fs.writeFileSync(prog.file, JSON.stringify(data));
    })
    .done();
});

prog
.command('restore')
.action(function() {
    var entries = JSON.parse(fs.readFileSync(prog.file));

    return dumper.restore(entries)
    .then(function() {
        console.log('Restore succeeded');
    })
    .done();
});

// Parse and fallback to help if no args
if(_.isEmpty(prog.parse(process.argv).args)) prog.help();

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
.option('-h, --host [host]', 'Hostname to connect to', 'localhost')
.option('-p, --port [port]', 'Port to connect to', '4001')
;

// Dump command
prog
.command('dump')
.action(function() {
    var dumper = require('../')(prog.host, prog.port);

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
    var dumper = require('../')(prog.host, prog.port);
    var entries = JSON.parse(fs.readFileSync(prog.file));

    return dumper.restore(entries)
    .then(function() {
        console.log('Restore succeeded');
    })
    .done();
});

// Parse and fallback to help if no args
if(_.isEmpty(prog.parse(process.argv).args)) prog.help();

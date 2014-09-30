#!/usr/bin/env node

// Requires
var _ = require('underscore');

var fs = require('fs');

// Comannder
var prog = require('commander');

// etcd-dump's package.json file
var pkg = require('../package.json');

// Dumper class
var createDumper = require('../');

// General options
prog
.version(pkg.version)
.option('-f, --file [json_file]', 'Path to JSON dump file for dumping/storing', './etcd_dump.json')
.option('-h, --host [value]', 'The etcd host', 'localhost')
.option('-p, --port [value]', 'The etcd port', '4001');

// Dump command
prog
.command('dump')
.action(function() {
    return createDumper(prog.host, prog.port)
    .dump()
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

    return createDumper(prog.host, prog.port)
    .restore(entries)
    .then(function() {
        console.log('Restore succeeded');
    })
    .done();
});

// Parse and fallback to help if no args
if(_.isEmpty(prog.parse(process.argv).args)) prog.help();

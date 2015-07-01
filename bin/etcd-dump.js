#!/usr/bin/env node

// Requires
var _ = require('underscore');

var fs = require('fs');

// Comannder
var prog = require('commander');

// etcd-dump's package.json file
var pkg = require('../package.json');

// Dumper class
var dumper = require('../');

// General options
prog
.version(pkg.version)
.option('-f, --file [json_file]', 'Path to JSON dump file for dumping/storing', './etcd_dump.json')
.option('-p, --path [path]', 'Root path to dump', '')
.option('--pretty', 'Pretty output')
.option('--host <localhost:4001>', 'ETCD Host Address and Port', 'localhost:4001')
.option('--ca <CA-File>', 'Path to CA-File')
.option('--cert <Cert-File>', 'Path to Cert-File')
.option('--key <Key-File>', 'Path to Key-File');

// Dump command
prog
.command('dump')
.action(function() {
    return dumper(prog).dump(prog.path)
    .then(function(data) {
        // Write file to disk
        fs.writeFileSync(prog.file, JSON.stringify(data, null, prog.pretty ? 2 : 0));
    })
    .done();
});

prog
.command('restore')
.action(function() {
    var entries = JSON.parse(fs.readFileSync(prog.file));

    return dumper(prog).restore(entries)
    .then(function() {
        console.log('Restore succeeded');
    })
    .done();
});

// Parse and fallback to help if no args
if(_.isEmpty(prog.parse(process.argv).args)) prog.help();

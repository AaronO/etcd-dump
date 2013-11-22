etcd-dump
=========

Command line utility for dumping/restoring etcd.

This tool intentionally does not care for etcd's inner workings, it's sole purpouse is to dump/restore the state of database by dumping all it's `key/value` `pairs` to `json` and then restoring them back.

This is useful for version and server migrations.

I built it because I needed it.

## Installing

```
npm install -g etcd-dump
```

## Usage

### Dumping :

```bash
$ etcd-dump dump
// outputs an etcd_dump.json
```

### Restoring :

```bash
$ etcd-dump restore
Restored successfuly
// Reads in the etcd_dump.json and restores it's values to the DB
```

### Help :

```bash
$ etcd-dump

  Usage: etcd-dump.js [options] [command]

  Commands:

    dump
    restore

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -f, --file [json_file]  Path to JSON dump file for dumping/storing
```

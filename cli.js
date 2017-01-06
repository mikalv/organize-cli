#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const chalk = require('chalk');
const helpers = require('./helpers');
const formats = require('./formats');
const path = require('path');

const getFileNames = helpers.getFileNames;
const getExtension = helpers.getExtension;
const organize = helpers.organize;

const argv = yargs
  .usage('organize <command>')
  .command('files', 'Organizes current directory', (yargs) => {

    const argv = yargs
      .usage('Usage: $0 files [options]')
      .alias('o', 'output').describe('o', 'Output directory - Creates one if doesn\'t exist ').string('o')
      .alias('s', 'source').describe('s', 'Source directory to organize').string('s')
      .example('$0 files -s ~/Downloads -o .')
      .argv;

    const outputDirectory = argv.output ? path.resolve(process.cwd(), argv.output) : process.cwd();
    const sourceDirectory = argv.source ? path.resolve(process.cwd(), argv.source) : process.cwd();

    let fileNames = getFileNames(sourceDirectory);
    console.log(chalk.green('Scanning'));

    fileNames.forEach((fileName) => {
      let fileExtension = getExtension(fileName).toUpperCase();

      for (let type in formats) {
        if (formats.hasOwnProperty(type) && formats[type].indexOf(fileExtension) >= 0) {
          organize(sourceDirectory, outputDirectory, fileName, type);
        }
      }
    });

    console.log(chalk.green('Done!'));
  })
  .help('h')
  .alias('h', 'help')
  .argv;

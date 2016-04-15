"use strict";

var program = require('commander');
var globToRegExp = require('glob-to-regexp');
var colors = require('colors/safe');
var _ = require('lodash');
var Table = require('cli-table2');
var Promise = require('bluebird');
var AWS = require('aws-sdk');

const createRegExp = name => globToRegExp(`*${name}*`, {
  flags: 'i',
  extended: true
});

var name;

program
  .version('1.0.0')
  .arguments('<stack-name>')
  .action(param => name = param)
  .option('-a, --all', 'list all instances besides those with online status')
  .option('-p, --profile [default]', 'the credential profile to use to authenticate on AWS', 'default')
  .parse(process.argv);

if (typeof name === 'undefined') program.help();

var credentials = new AWS.SharedIniFileCredentials({ profile: program.profile });
var opsWorks = Promise.promisifyAll(new AWS.OpsWorks({
  credentials: credentials,
  region: 'us-east-1'
}));

Promise
  .try(() => opsWorks.describeStacksAsync().get('Stacks'))
  .filter(stack => createRegExp(name).test(stack.Name))
  .then(stacks => {
    var stacksMap = _.keyBy(stacks, 'StackId');

    return Promise
      .props({
        layers: Promise
          .map(stacks, stack => opsWorks.describeLayersAsync({ StackId: stack.StackId }).get('Layers'))
          .then(_.flatten)
          .then(layers => _.keyBy(layers, 'LayerId')),
        instances: Promise
          .map(stacks, stack => opsWorks.describeInstancesAsync({ StackId: stack.StackId }).get('Instances'))
          .then(_.flatten)
          .then(instances => program.all ? instances : instances.filter(instance => instance.Status === 'online'))
      })
      .then(result => {
        let instances = _.sortBy(result.instances, [
          'Status',
          o => stacksMap[o.StackId].Name,
          o => result.layers[_.first(o.LayerIds)].Name,
          'Hostname', 'Ec2InstanceId', 'PrivateIp'
        ]);

        return [result.layers, instances];
      })
      .spread((layers, instances) => {
        let table = new Table({
          head: [ 'Stack', 'Layer', 'Status', 'Hostname', 'Instance', 'Private IP' ],
          style: { head: [ 'cyan' ] }
        });

        table.push.apply(table, instances.map(instance => [
          stacksMap[instance.StackId].Name,
          layers[_.first(instance.LayerIds)].Name,
          instance.Status === 'online' ? colors.green(instance.Status) : colors.red(instance.Status),
          instance.Hostname,
          instance.Ec2InstanceId,
          instance.PrivateIp || '-'
        ]));

        return table;
      });
  })
  .then(str => str.toString())
  .then(console.log)
  .catch(console.log);

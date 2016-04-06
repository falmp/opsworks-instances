# OpsWorks Instances

OpsWorks Instances is a Node.js script to list EC2 instances from an OpsWorks stack.

## Installation

It's recommended that you use [npm](https://www.npmjs.com/) to install OpsWorks Instances globally:

```bash
$ npm install -g opsworks-instances
```

This will install `opsworks-instances` and all required dependencies. OpsWorks Instances requires Node.js 4.0.0 or newer.

## Usage

Execute `opsworks-instances` passing an OpsWorks stack name glob:

```bash
$ opsworks-instances server
┌─────────┬─────────┬─────────┬──────────┬────────────┬────────────────┐
│ Stack   │ Layer   │ Status  │ Hostname │ Instance   │ Private IP     │
├─────────┼─────────┼─────────┼──────────┼────────────┼────────────────┤
│ ServerA │ apps    │ online  │ apps1    │ i-f789ab11 │ 172.19.222.103 │
├─────────┼─────────┼─────────┼──────────┼────────────┼────────────────┤
│ ServerA │ workers │ online  │ workers1 │ i-d68eac22 │ 172.19.222.220 │
├─────────┼─────────┼─────────┼──────────┼────────────┼────────────────┤
│ ServerB │ apps    │ online  │ apps1    │ i-d5306333 │ 172.19.222.121 │
├─────────┼─────────┼─────────┼──────────┼────────────┼────────────────┤
│ ServerA │ apps    │ stopped │ apps2    │ i-a88ba944 │ -              │
├─────────┼─────────┼─────────┼──────────┼────────────┼────────────────┤
│ ServerB │ workers │ stopped │ workers1 │ i-e2376455 │ -              │
└─────────┴─────────┴─────────┴──────────┴────────────┴────────────────┘
```

You can get a help message by passing the `--help` parameter:

```bash
$ opsworks-instances --help

  Usage: opsworks-instances [options] <stack-name>

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -p, --profile [default]   the credential profile to use to authenticate on AWS
```

## Authentication

OpsWorks Instances uses the `~/.aws/credentials` file to authenticate to AWS and manage profiles. The syntax is:

```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

[production]
aws_access_key_id=AKIAI44QH8DHBEXAMPLE
aws_secret_access_key=je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY
```

If you have `aws-cli` installed, you can create one by executing:

```bash
$ aws configure
```

More information about the credentials file can be found [here](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files).

## License

The OpsWorks Instances is licensed under the MIT license. See [License File](LICENSE.md) for more information.

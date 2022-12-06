# emr-managed-scaling-cluster

Easy CloudFormation deployment for an EMR cluster with managed autoscaling.

## Table of Contents
- [emr-managed-scaling-cluster](#emr-managed-scaling-cluster)
  * [Table of Contents](#table-of-contents)
  * [Description](#description)
    + [EMR Configuration](#emr-configuration)
      - [EMR Version](#emr-version)
      - [Applications](#applications)
  * [Quickstart](#quickstart)
  * [Installation](#installation)
    + [Prerequisites](#prerequisites)
    + [Environment Variables](#environment-variables)
    + [AWS Credentials](#aws-credentials)
  * [Usage](#usage)
    + [EMR Version](#emr-version-1)
    + [Network Configuration](#network-configuration)
    + [AWS Deployment](#aws-deployment)
    + [Makefile Usage](#makefile-usage)
  * [Troubleshooting](#troubleshooting)
  * [References & Links](#references---links)
  * [Authors](#authors)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

## Description
This project uses CloudFormation templates to deploy an EMR cluster with managed autoscaling policy. This can be used to quickly deploy a cluster for development or data analysis. 

### EMR Configuration

#### EMR Version
The default EMR version is `emr-6.5.0`. This can be changed by setting the `EMR_VERSION` environment variable in `.env`.

#### Applications
The following applications are installed by default:
* Hadoop
* Hive
* Tez
* Hue
* Spark
* Livy
* JupyterHub
* JupyterEnterpriseGateway


## Quickstart
1. Configure your AWS credentials.
2. Add environment variables to `.env`.
3. Run `make deploy` to deploy the cluster.

## Installation
Follow the steps to configure the deployment environment.

### Prerequisites
* AWSCLI
* jq

### Environment Variables

Sensitive environment variables containing secrets like passwords and API keys must be exported to the environment first.

Create a `.env` file in the project root.
```bash
STAGE=dev
APP_NAME=emr-managed-scaling
AWS_REGION=us-east-1
EMR_VERSION=emr-6.5.0
SUBNET_ID=<subnet ID>
```

***Important:*** *Always use a `.env` file or AWS SSM Parameter Store or Secrets Manager for sensitive variables like credentials and API keys. Never hard-code them, including when developing. AWS will quarantine an account if any credentials get accidentally exposed and this will cause problems.*

***Make sure that `.env` is listed in `.gitignore`***

### AWS Credentials
Valid AWS credentials must be available to AWS CLI and SAM CLI. The easiest way to do this is running `aws configure`, or by adding them to `~/.aws/credentials` and exporting the `AWS_PROFILE` variable to the environment.

For more information visit the documentation page:
[Configuration and credential file settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

## Usage

### EMR Version
The EMR version can  be set using the EMR_VERSION environment variable in `.env`. The default is `emr-6.5.0`. For a list of available versions please see the [docs](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-release-components.html).

### Network Configuration
The only required variable for network configuration is the SUBNET_ID variable which must be present in `.env`.

### AWS Deployment
Once an AWS profile is configured and environment variables are available, the application can be deployed using `make`.
```bash
make deploy
```

### Makefile Usage
```bash
# Deploy all layers
make deploy

# Delete all layers
make delete
```

## Troubleshooting
* Check your AWS credentials in `~/.aws/credentials`
* Check that the environment variables are available to the services that need them
* Check that the correct environment or interpreter is being used for Python

## References & Links
- [AWS EMR workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/c86bd131-f6bf-4e8f-b798-58fd450d3c44/en-US)
- [EMR documentation](https://docs.aws.amazon.com/emr/index.html)
- [CloudFormation EMR documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-cluster.html)

## Authors
**Primary Contact:** Gregory Lindsey ([@abk7777](https://github.com/abk7777))

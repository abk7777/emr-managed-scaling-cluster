##########################
# Bootstrapping variables
##########################

# Application specific environment variables
include .env
export

# Base settings, these should almost never change
export SERVICE ?= ${STAGE}-${APP_NAME}
export ROOT_DIR ?= $(shell pwd)
export LOGS_DIR ?= "___logs"
export LOGS_PATH ?= $(shell echo "${LOGS_DIR}/app.log")
export AWS_ACCOUNT ?= $(shell aws sts get-caller-identity --query Account --output text)

CREATE_LOGS_DIR := $(shell [ -d ${LOGS_DIR} ] || mkdir -p ${LOGS_DIR})

target:
	$(info ${HELP_MESSAGE})
	@exit 0

init:
	@[ -d ${LOGS_DIR} ] || mkdir -p ${LOGS_DIR}

check.env:
ifndef AWS_PROFILE
$(error AWS_PROFILE is not set. Please select an AWS profile to use.)
endif
ifndef STAGE
$(error STAGE is not set. Please add STAGE to the environment variables.)
endif
ifndef APP_NAME
$(error APP_NAME is not set. Please add APP_NAME to the environment variables.)
endif
ifndef AWS_REGION
$(error AWS_REGION is not set. Please add AWS_REGION to the environment variables.)
endif
ifndef LOG_URI
$(error LOG_URI is not set. Please add LOG_URI to the environment variables.)
endif
ifndef EMR_RELEASE_LABEL
$(error EMR_RELEASE_LABEL is not set. Please add EMR_RELEASE_LABEL to the environment variables.)
endif
ifndef SUBNET_ID
$(error SUBNET_ID is not set. Please add SUBNET_ID to the environment variables.)
endif

env.confirm:
	@printf "\n************ Deployment Configuration ************\n\n"
	@[ -f ./.env ] && cat ./.env || exit 1
	@printf "\n\n**************************************************"
	@printf "\n\nDo you wish to deploy with this configuration to account $${AWS_ACCOUNT}? [y/N] " && read ans && [ $${ans:-N} = y ]

deploy: init ##=> Deploy services
	@echo "$$(gdate -u +'%Y-%m-%d %H:%M:%S.%3N') - Deploying $${SERVICE} to $${AWS_ACCOUNT}" 2>&1 | tee -a $$LOGS_PATH
	$(MAKE) check.env
	$(MAKE) env.confirm
	$(MAKE) emr.deploy

# Deploy specific stacks
emr.deploy:
	@echo "$$(gdate -u +'%Y-%m-%d %H:%M:%S.%3N') - Deploying EMR cluster" 2>&1 | tee -a $$LOGS_PATH
	$(MAKE) -C emr/ deploy

delete: ##=> Delete services
	@echo "$$(gdate -u +'%Y-%m-%d %H:%M:%S.%3N') - Deleting $${SERVICE} in $${AWS_ACCOUNT}" 2>&1 | tee -a $$LOGS_PATH
	$(MAKE) emr.delete

# Delete specific stacks
emr.delete:
	$(MAKE) -C emr/ delete

define HELP_MESSAGE

	Environment variables:

	STAGE: "${STAGE}"
		Description: Feature branch name used as part of stacks name

	APP_NAME: "${APP_NAME}"
		Description: Stack Name already deployed

	AWS_ACCOUNT: "${AWS_ACCOUNT}":
		Description: AWS account ID for deployment

	AWS_REGION: "${AWS_REGION}":
		Description: AWS region for deployment

	Common usage:

	...::: Deploy all CloudFormation based services :::...
	$ make deploy

	...::: Delete all CloudFormation based services and data :::...
	$ make delete

endef

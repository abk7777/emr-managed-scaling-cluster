import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as emr from 'aws-cdk-lib/aws-emr';
import * as iam from 'aws-cdk-lib/aws-iam';

const config = {
    EMR_CLUSTER_NAME: process.env.EMR_CLUSTER_NAME ?? 'emr-managed-scaling-cluster',
    SUBNET_ID: process.env.SUBNET_ID!,
};

export class EmrManagedScalingClusterStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new EmrCluster(this, 'EmrCluster', {
            clusterName: config.EMR_CLUSTER_NAME,
            subnetId: config.SUBNET_ID,
        });
    }
}

export interface EmrClusterProps {
    clusterName: string;
    subnetId: string;
}

export class EmrCluster extends Construct {

    public readonly cluster: emr.CfnCluster;

    constructor(scope: Construct, id: string, props: EmrClusterProps) {
        super(scope, id);

        const emrScalingInstanceRole = new iam.Role(this, 'EmrScalingInstanceRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonElasticMapReduceforEC2Role'),
            ]
        });

        // Blocked: Invalid InstanceProfile when deploying with CDK
        const emrScalingInstanceProfile = new iam.CfnInstanceProfile(this, 'EMRScalingInstanceProfile', {
            roles: [emrScalingInstanceRole.roleName],
            instanceProfileName: emrScalingInstanceRole.roleName
        });
        emrScalingInstanceProfile.node.addDependency(emrScalingInstanceRole);

        const emrScalingClusterServiceRole = new iam.Role(this, 'EmrScalingClusterServiceRole', {
            assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonElasticMapReduceRole'),
            ]
        });

        const masterInstanceGroupConfig: emr.CfnCluster.InstanceGroupConfigProperty = {
            name: 'Master',
            instanceCount: 1,
            instanceType: 'm5.xlarge',
            market: 'ON_DEMAND'
        }
        const coreInstanceGroupConfig: emr.CfnCluster.InstanceGroupConfigProperty = {
            name: 'Core',
            instanceCount: 1,
            instanceType: 'r5.xlarge',
            market: 'ON_DEMAND'
        }
        const taskInstanceGroupConfig: emr.CfnCluster.InstanceGroupConfigProperty = {
            name: 'Task',
            instanceCount: 1,
            instanceType: 'r5.xlarge',
            market: 'ON_DEMAND',
        }

        this.cluster = new emr.CfnCluster(this, 'EmrCluster', {
            name: props.clusterName,
            releaseLabel: 'emr-6.2.0',
            applications: [
                {
                    name: 'Hadoop',
                },
                {
                    name: 'Hive',
                },
                {
                    name: 'Tez',
                },
                {
                    name: 'Hue',
                },
                {
                    name: 'Spark',
                },
                {
                    name: 'Livy',
                },
            ],
            instances: {
                masterInstanceGroup: masterInstanceGroupConfig,
                coreInstanceGroup: coreInstanceGroupConfig,
                taskInstanceGroups: [taskInstanceGroupConfig],
                ec2SubnetId: props.subnetId,
                keepJobFlowAliveWhenNoSteps: true,
                terminationProtected: false,
            },
            serviceRole: emrScalingClusterServiceRole.roleName,
            jobFlowRole: emrScalingInstanceProfile.logicalId,
            visibleToAllUsers: true,
            managedScalingPolicy: {
                computeLimits: {
                    unitType: 'Instances',
                    minimumCapacityUnits: 1,
                    maximumCapacityUnits: 5,
                    maximumOnDemandCapacityUnits: 2
                },
            },
        });
    }
}

import { Stack } from 'aws-cdk-lib'
import type { StackProps } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'

export class CdkSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, 'MyVPC', {
      maxAzs: 3, // Default is all AzZs in region
    })

    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc,
    })

    // Create a load-balanced Fargate service and make it public
    const albFargate = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'MyFargateService',
      {
        cluster: cluster,
        cpu: 512,
        desiredCount: 6,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        },
        memoryLimitMiB: 2048, // Default is 512
        publicLoadBalancer: true, // Default is false
      },
    )
    console.log(albFargate)
  }
}

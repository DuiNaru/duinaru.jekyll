---
layout: single
author_profile: true
comments: true
share: true
related: true
category: aws
tags: [aws, ec2, ssm, cloudtrail, cloudwatch, cloud9]
lang: ko
permalink: "/:year/:month/:day/auto-start-ec2-on-sign-in"
title: SSM와 CloudWatch로 로그인할 때, EC2가 자동 시작되게 하기
---

Cloud9를 수동으로 만든 EC2로 사용하다보니, 자동으로 만들 때 사용할 수 있는 EC2의 자동 시작-종료 기능을 사용할 수 없어서, 만들어 보기로 했습니다.

다만, Cloud9이 시작할 때 EC2를 시작 시킬 수 없어서 Console에 Sign in 할 때, 시작 되도록 만들었습니다.

## AWS System Manager

EC2를 실행시키기 위해 SSM을 사용할 생각입니다.

그러기 위해서는 SSM가 EC2를 관리 할 수 있도록 설정을 해야 합니다.

### IAM의 Role 생성 : AmazonSSMManagedInstanceCore

EC2를 SSM에서 사용하기 위해서 IAM role을 설정해야 합니다.

AmazonSSMManagedInstanceCore의 policy를 선택해서 하나 만들어 줍니다.

> ![AmazonSSMManagedInstanceCore](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\AmazonSSMManagedInstanceCore.png)

해당 IAM을 자동 시작시키려는 EC2에 붙여 주면 됩니다.

[Attaching an IAM Role to an Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html?icmpid=docs_ec2_console#attach-iam-role)

위의 링크처럼 붙여주면 됩니다.

### IAM의 Role 생성 : AmazonSSMAutomationRole

이번에는 SSM을 실행 할 때 필요한 IAM role을 만들어야 합니다.

AmazonSSMAutomationRole의 policy를 선택해서 만들어 주면 됩니다.

> ![AmazonSSMAutomationRole](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\AmazonSSMAutomationRole.png)

다음은 로그인 이벤트가 발생하면 SSM으로 EC2가 시작되도록 설정합니다.

## CloudTrail 설정

[로그인 이벤트](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-aws-console-sign-in-events.html)를 이용하기 위해서는 CloudTrail를 설정할 필요가 있습니다.

CloudTrail의 왼쪽 메뉴에서 Trails - Create Trail 를 순서대로 눌러줍시다.

> ![create trail](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\create-trail.png)

만들고 설정을 보면 Logging 이 ON 이 되어 있는 것을 확인 할 수 있습니다.

> ![Logging ON](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\logging-on.png)

설정이 끝났습니다.

## CloudWatch의 Rules설정

로그인 이벤트를 CloudWatch 에서 감지해서 처리하도록 해봅시다.

CloudWatch의 왼쪽 메뉴에서 Rules - Creates rule 를 순서대로 눌러줍시다.

### Event Source

> ![create rule](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\create-rule.png)

Service Name 은 AWS Console Sign-in 을 선택합니다. 

어떤 유저라도 로그인 할 때 처리할 생각이면, Any user을 선택하고,

특정 유저만 로그인 할 때 처리할 생각이면, Specific users(s) by ARN 을 선택해서 해당 유저의 arn 을 넣어줍시다.

### Targets

![target setting](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\target.png)

로그인 이벤트의 기록과 EC2가 시작되도록 설정합시다.

CloudWatch log Group에는 Log Group를 적당히 입력하고, 

SSM Automation은 Document를 AWS-StartEC2Instance를 선택, InstanceId에 시작시키고 싶은 인스턴스의 ID를 넣어줍니다.

그 아래는 Use existing role 을 선택하고 [IAM의 Role 생성 : AmazonSSMAutomationRole](#iam의-role-생성--amazonssmautomationrole)에서 만든 Role를 지정해줍시다.

> ![create rule step2](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\create-rule-2.png)

name을 지정하고 Enabled가 체크된 상태에서 만들면 됩니다.

## 확인해보기

제대로 EC2가 실행되는지 확인해 봅시다.

그러려면 다시 로그인을 해야 겠네요.

1~2분정도의 시간이 지나니, [Targets](#targets)에서 만든 CloudWatch의 Log Group에 로그인 이벤트가 기록되고, EC2가 기동하고 있었습니다.

## 후기

CloudTrail를 설정하지 않아, 로그인 이벤트가 연결 안 된다거나

SSM Automation의 role를 제대로 설정하지 않아 rule이 실행 되지 않다거나 등등

이것저것 시행착오를 겪어서 성공하게 되었네요.

Cloud9에서 만들 때 사용가능한 EC2의 자동 시작과 비슷하게 쓸 수 있겠네요.

다음엔 일정 시간 동안 접속이 없으면 종료되도록 해 볼 생각입니다.
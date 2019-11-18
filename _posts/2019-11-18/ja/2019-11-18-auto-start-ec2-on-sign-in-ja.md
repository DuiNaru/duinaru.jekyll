---
layout: single
author_profile: true
comments: true
share: true
related: true
category: aws
tags: [aws, ec2, ssm, cloudtrail, cloudwatch, cloud9]
lang: ja
permalink: "/:year/:month/:day/auto-start-ec2-on-sign-in"
title: SSMとCloudWatchでログインする時、EC2が自動起動されるように設定
---

Cloud9を手動で作ったEC2で使用していまして、自動で作る時に使用できるEC2の自動起動のようにしたいと思いました。

しかし、Cloud9が始まる時にEC2をスタートさせることはできなくてConsoleにSign inする時、起動されるようにしました。

## AWS System Manager

EC2を起動させるためにSSMを利用します。

そのため、SSMがEC2を管理できるようにセットアップをしなければなりません。

### IAM Role 作成 : AmazonSSMManagedInstanceCore

EC2をSSMで使用できるようにIAM Roleを作成します。

AmazonSSMManagedInstanceCoreのpolicyを選択し、作ります。

> ![AmazonSSMManagedInstanceCore](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\AmazonSSMManagedInstanceCore.png)

作ったIAMを自動起動させようとするEC2にattachすればいいです。

[Attaching an IAM Role to an Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html?icmpid=docs_ec2_console#attach-iam-role)

上のリンクのようにすればいいです。

### IAM Role 作成 : AmazonSSMAutomationRole

今度はSSMを実行する時に必要なIAM Roleを作成します。

AmazonSSMAutomationRoleのpolicyを選択し、作ります。

> ![AmazonSSMAutomationRole](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\AmazonSSMAutomationRole.png)

このroleは後で使います。

次はログインイベントが発生するとEC2が起動されるように設定します。

## CloudTrail 設定

[ログインイベント](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-aws-console-sign-in-events.html)を使用するためにはCloudTrailを設定する必要があります。

CloudTrailの左メニューで Trails - Create Trail を選択しましょう。

> ![create trail](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\create-trail.png)

作成し、設定を見るとLoggingがONになっていることが確認できます。

> ![Logging ON](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\logging-on.png)

CloudTrailの設定が終わりました。

## CloudWatchのRules設定

ログインイベントをCloudWatchで感知し、処理されるようにしましょう。

CloudWatchの左メニューで Rules - Creates rule を選択します。

### Event Source

> ![create rule](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\create-rule.png)

Service NameはAWS Console Sign-inを選択します。

どんなユーザーもログインする時、イベントに対して処理させたいと思ったらAny userを選択し、

特定のユーザーがログインする時、イベントに対して処理させたいと思ったらSpecific users(s) by ARNを選択し、ユーザーのarnを入力します。

### Targets

![target setting](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\target.png)

ログインイベントの記録とEC2が起動されるように設定します。

CloudWatch log GroupはLog Groupを入力し、

SSM AutomationはDocumentをAWS-StartEC2Instanceに選択し、InstanceIdに起動させたいEC2のInstanceIDを入力します。

下はUse existing roleを選択し、[IAM Role 作成 : AmazonSSMAutomationRole](#iam-role-作成--amazonssmautomationrole)で作成したRoleを指定します。

> ![create rule step2](\assets\images\2019-11-18-auto-start-ec2-on-sign-in\create-rule-2.png)

nameを入力し、Enabledがチェックされた状態で作ります。

## 確認

EC2が自動的に起動されるか確認してみましょう。

そのためなら、再ログインしなければならないですね。

1~2分ぐらいの時間が過ぎたら、[Targets](#targets)で作成したCloudWatchのLog Groupにログインイベントが記録され、EC2が起動されていました。

## 感想

CloudTrailを設定しなくて、ログインイベントが繋がらないとか、

SSM Automationのroleをちゃんと設定しなくてruleが実行できないとか等、

試行錯誤を繰り返して成功するようになりました。

Cloud9で作る時に使用可能なEC2の自動起動と似ているように使用することができそうです。

次は、一定の時間で接続がないと終了されるようにするつもりです。
---
layout: single
author_profile: true
comments: true
share: true
related: true
category: aws
tags: [aws, ec2, cloudwatch, alarm, ssh, crontab]
lang: "ja"
permalink: "/:year/:month/:day/stop-ec2-when-no-ssh-connection-for-a-while"
title: "CloudWatchを利用し、一定時間内でSSHのコネクションがない場合はEC2を自動終了させる方法"
---
主にCloud9で使用するEC2がSSHのコネクションがない場合は使用することがなく、一定時間を待機した後に自動終了されるように作りました。

EC2で実行されるスクリプトだけでも出来そうですが、AWSでSSHのモニタリングもできるようにCloudWatchを利用しました。

## IAM User 作成

CloudWatchにSSHのコネクションの数を送信する役割のUserが必要です。

aws cliで接続が可能で、権限はCloudWatchAgentServerPolicyを持つUserを作成しました。

> ![user-permission](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\user-permission.png)

## EC2にaws cliを設定

CloudWatchにSSHのコネクションの数を送るため、EC2にaws cliをインストールしてUserを設定します。

### インストール

aws cliをインストールします。

[Install the AWS CLI version 1 on Linux](https://docs.aws.amazon.com/cli/latest/userguide/install-linux.html)

### User設定

作ったUserで設定します。

[Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

## SSHのコネクションの数を求める

繋がれているSSHを数を求めた後で、CloudWatchに送信することができるでしょう。

### 繋がっているユーザーを求める方法

```
who
```

上記のコマンドで現在に接続されているユーザーを求められます。

SSHで接続した場合、次のように確認できます。

> ![SSH-User](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\ssh-users.png)

しかし、Cloud9で接続した場合は何も出力されないことが確認できます。

> ![Cloud9-User](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\cloud9-users.png)

### Cloud9のコネクションは確認できない

何故でしょう。

Cloud9の[SSH Host Requirements](https://docs.aws.amazon.com/cloud9/latest/user-guide/ssh-settings.html#ssh-settings-requirements)を見れば、SSHの接続が要求されていて、SSHを利用することは確かのようです。

### 現在、実行されているSSHDの数を求める

SSHで繋がれるようですので、実行しているSSHDを求めてみます。

```
ps -A x | grep "sshd"
```

> ![sshd list](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\sshd-list.png)

`sshd: ubuntu [priv]`と`sshd: ubuntu@notty`がそれぞれ2個ずつ、4個が見えます。

SSHで接続するときにセキュリティー強化の一環でprivでプロセスを作り、子プロセスで処理させるようです。

> [UsePrivilegeSeparation](https://linux.die.net/man/5/sshd_config)

それで一つのSSHで二つのプロセスが作成されるようです。

では、現在は二つのSSHのコネクションがあるということが分かります。

次のコマンドでSSHのコネクションの数を求めます。

```
ps -A x | grep "sshd" | grep "\\[priv\\]" | wc -l
```

> ![sshd数](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\sshd-count.png)

## SSH数を送信

求めたSSHの数がCloudWatchに送信されるようにします。

```
put-metric-data
--namespace <value>
--dimensions <value>
--metric-name <value>
--value <value>
--timestamp <value>
...and more options
```

### [put-metric-data](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-metric-data.html)

aws cliを利用してCloudWatchにMetricを送るコマンドです。

送信したデータを一定の時間単位で記録し、時間ごとに変化を確認することができるようになります。

このコマンドでSSHの数をCloudWatchに送信することができます。

### demension

データの詳細情報のような感じで設定できます。

*`InstanceId=インスタンスID`でインスタンスIDを設定しましたが、これはCloudWatch Alarmで**インスタンス終了アクションは`InstanceId`が設定されているMetricだけが可能**でしたからです。*

その理由で、自動終了のためには`InstanceId`を設定しなければなりません。

### value

送信するMetricの値です。

[現在、実行されているSSHDの数を求める](#現在実行されているsshdの数を求める)で分かったコネクションの数を入れました。

### timestamp

Metricの時間を指定することができます。

送信するときの時間をUTCの形で入れました。

### crontab

送信を一定周期で繰り返すため、必要です。

詳しくは[こちら](https://help.ubuntu.com/community/CronHowto)で確認でき、設定は次のようにします。

#### 繰り返されるスクリプトを作成

`/home/ubuntu/ssh-count.sh`で次のようなスクリプトを作りました。

```
#!/bin/bash

SSH_CONNECTIONS=$(ps -A x | grep sshd | grep \\[priv\\] | wc -l)

TIMESTAMP=$(date --utc +%FT%T.%3NZ)

/home/ubuntu/.local/bin/aws cloudwatch put-metric-data --metric-name "SSH Connections" --dimensions InstanceId="インスタンスID" --namespace "EC2" --value $SSH_CONNECTIONS --timestamp $TIMESTAMP
```

metric-nameは指定したい名前で、InstanceIdは終了させたいインスタンスIDを入れます。

#### crontabにスクリプトを登録

`crontab -e`に1分ごとに遂行されるように設定しました。

一番下に次のコマンドを追加すればいいです。

```
*/1 * * * * /home/ubuntu/ssh-count.sh
```

### 確認

CloudWatch - Metricsで Custom Namespacesの項目のEC2 - InstanceIdから確認できます。

## EC2自動終了

これからは一定時間でSSHの数が0ならばEC2を自動終了するように作ります。

### CloudWatch Alarm設定

CloudWatch - Alarmsで Create alarmをクリックしてAlarmを作ります。

### Specify metric and conditions

この画面では使用するMetricの選択と設定を行います。

#### Metric

Select MetricをクリックしてSSHのMetricを選択し、StatisticとPeriodを確認します。

Periodは期間内で集められたMetricをStatisticで設定した方法で統計して確認することになりますので、1分ごとの間でデータを全部見るためにPeriodを1分に設定しました。

#### Conditions

Threshold typeはStatic、WheneverはLower/Equal、thanは0で設定し、値が0以下でしたらAlarmになるようにしました。

> ![Threshold](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\threshold.png)

#### Additional configuration

0以下になるとたんにAlarmにならないようにDatapoints to alarmを設定しました。

> ![Datapoints to alarm](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\datapoints-to-alarm.png)

最近の15個内で0以下が15個でしたらAlarmになるようにしました。Periodを1分で設定したので、15分の間にずっと0以下でしたらAlarmになることです。

### Configure actions

この画面ではAlarmの状態に対し、取るActionを設定します。

#### Notification

AWS SNSに通知を送る考えでしたら、設定します。

ないなら、Removeをクリックします。

#### EC2 action

EC2に終了の命令を出すことができます。

下のようにAlarmの場合にStop this instanceをするように設定します。

> ![Stop this instance](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\stop-this-instance.png)

### 確認

CloudWatch - Alarmsで確認できます。

終了するときはALARM、終了されて時間が経つとINSUFFICIENT、実行されているときはOKに変わることが見れます。

## 限界

- とても短いコネクション

1分ごとに実行中のSSHDを数えて送信することで、サンプリングの間に実行されて終了されるSSHDがあったら、記録されないでしょう。

このようなコネクションは意味があるとは思いませんので、問題にはならなさそうです。

SSHが繋がる時に`put-metric-data`を実行するようにすれば解決できることもあるでしょう。

- コネクションがなくても待機しているSSHD

使用していなくてもSSHDがすぐに終了されることではありませんので、正確なコネクションの数を求めるためには追加の設定が必要になります。[`ClientAliveIntervalとClientAliveCountMax`](https://linux.die.net/man/5/sshd_config)のような設定でしょう。

- 終了の直前にSSHが繋がれる

SSHの数を送信してAlarmで把握し、終了される間に新たに接続がある場合を考えられますが、接続した直後に終了になりますので、問題なさそうです。

## 感想

Cloud9のみで利用する考えなら、Cloud9でEC2を構築する方がCloud9に合わせて終了されるのでいいです。

しかし、自動終了の機能はCloud9を終了して一定時間の後にEC2を終了させるため、Cloud9を終了しても利用する場合があったら、自動終了の機能をOFFにしなければならなりませんので、直接に構築したEC2とさほど違わないです。

または、手動で構築したEC2も考えられます。

このような場合も自動で終了させることが出来るということが分かりました。

このブログの方法で*SSHのコネクションの数を求めて送信*するところを変更するば、他の状況でも使えるでしょう。
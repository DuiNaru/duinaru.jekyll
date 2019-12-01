---
layout: single
author_profile: true
comments: true
share: true
related: true
category: aws
tags: [aws, ec2, cloudwatch, alarm, ssh, crontab]
lang: "ko"
permalink: "/:year/:month/:day/stop-ec2-when-no-ssh-connection-for-a-while"
title: "CloudWatch를 이용하여 일정 시간 동안 SSH 연결이 없을 때, EC2 자동 종료 시키기"
---
주로 Cloud9로 사용하는 EC2가 SSH 연결이 없을 때는 사용할 일이 없어서, 일정 시간 대기 한 뒤에 자동 종료가 되도록 만들어 보았습니다.

EC2에서 실행되는 스크립트 만으로도 가능할 듯 하지만, AWS에서 SSH의 연결 수도 모니터링할 수 있게 하도록 CloudWatch를 이용하였습니다.

## IAM User 작성

CloudWatch로 SSH의 연결 수를 보내는 역할을 하는 User가 필요합니다.

aws cli에서 접속이 가능하고 권한은 CloudWatchAgentServerPolicy을 가진 User를 생성하였습니다.

> ![user-permission](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\user-permission.png)

## EC2에 aws cli 설정

CloudWatch로 SSH의 연결 수를 보내기 위해서 EC2에 aws cli를 설치하고, 위에서 만든 User를 설정해줍니다.

### 설치

aws cli를 설치해줍니다.

[Install the AWS CLI version 1 on Linux](https://docs.aws.amazon.com/cli/latest/userguide/install-linux.html)

### User 설정

방금 만든 User로 설정해줍니다.

[Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

## SSH 연결 수 알아내기

현재 연결된 SSH의 수를 알아낼 수 있어야 CloudWatch로 보낼 수 있을 것입니다.

### 연결 되어 있는 사용자를 알아내는 방법

```
who
```

해당 명령어로 현재 접속되어 있는 사용자를 알아 낼 수 있습니다.

SSH로 접속했을 경우, 아래와 같이 확인할 수 있습니다.

> ![SSH-User](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\ssh-users.png)

다만, Cloud9로 접속했을 경우에는 아무것도 나오지 않는 것을 확인 할 수 있습니다.

> ![Cloud9-User](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\cloud9-users.png)

### Cloud9의 연결은 확인 되지 않음

왜 일까요?

Cloud9의 [SSH Host Requirements](https://docs.aws.amazon.com/cloud9/latest/user-guide/ssh-settings.html#ssh-settings-requirements)을 보면 SSH 접속 가능이 요구되어 있어서 SSH를 이용하는 것은 알 수가 있습니다.

### 현재 실행 중인 SSHD의 갯수로 알아내기

SSH로 연결은 하는 것 같으니까, 실행 중인 SSHD를 알아봅시다.

```
ps -A x | grep "sshd"
```

> ![sshd list](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\sshd-list.png)

`sshd: ubuntu [priv]`과 `sshd: ubuntu@notty`이 각각 2개씩, 총 4개가 보이네요. 

SSH로 접속할 때 보안 강화의 방법으로 priv 로 프로세스를 만든다음, 자식 프로세스를 만들어서 처리시킨다고 하네요. 

> [UsePrivilegeSeparation](https://linux.die.net/man/5/sshd_config)

그래서 한 개의 SSH 접속에 2개의 프로세스가 만들어 지나 봅니다.

그럼 현재 2개의 SSH 연결이 있다는 것을 알 수 있네요. 

다음 명령으로 SSH 연결 수를 알아냅니다.

```
ps -A x | grep "sshd" | grep "\\[priv\\]" | wc -l
```

> ![sshd 수](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\sshd-count.png)

## SSH 연결 수 전송

알아낸 SSH 연결 수를 CloudWatch에 전송하도록 합니다.

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

aws cli를 이용하여 CloudWatch에 Metric을 보내는 명령입니다.

보낸 데이터를 시간 단위로 기록하게 되고, 시간의 경과에 따른 변화를 살펴 볼 수 있게 됩니다.

해당 명령어로 위에서 알아낸 SSH의 연결 수를 CloudWatch로 보낼 수 있게 됩니다.

### demension

보내는 데이터의 상세 정보와 같은 느낌으로 설정할 수 있습니다.

*`InstanceId=인스턴스ID`로 인스턴스 ID를 설정하였는데, 이는 CloudWatch Alarm에서 _인스턴스 종료 명령은 `InstanceId`가 설정되어 있는 Metric만 가능_하였기 때문입니다.*

그렇기 때문에, 자동 종료를 위해서는 `InstanceId`로 설정해주어야 합니다.

### value

보내는 Metric의 값 입니다.

[현재 실행 중인 SSHD의 갯수로 알아내기](#현재-실행-중인-sshd의-갯수로-알아내기)에서 알아낸 연결 수를 넣어주었습니다.

### timestamp

Metric의 시간을 지정해 줄 수 있습니다.

보낼 때의 시간을 구해서 UTC 의 형태로 넣어주었습니다.

### crontab

전송을 일정 주기로 반복 시키기 위해서 사용하였습니다.

자세한 설명은 [이곳](https://help.ubuntu.com/community/CronHowto)을 보면 되고, 아래와 같이 설정합니다.

#### 반복 수행할 스크립트 작성

`/home/ubuntu/ssh-count.sh` 으로 다음과 같은 스크립트를 만들었습니다.

```
#!/bin/bash

SSH_CONNECTIONS=$(ps -A x | grep sshd | grep \\[priv\\] | wc -l)

TIMESTAMP=$(date --utc +%FT%T.%3NZ)

/home/ubuntu/.local/bin/aws cloudwatch put-metric-data --metric-name "SSH Connections" --dimensions InstanceId="인스턴스ID" --namespace "EC2" --value $SSH_CONNECTIONS --timestamp $TIMESTAMP
```

metric-name는 지정 하고 싶은 이름으로, InstanceId는 종료 시키고 싶은 인스턴스의 ID를 넣어줍니다.

#### crontab에 스크립트 등록

`crontab -e`에 1분 마다 스크립트를 수행하도록 설정하였습니다.

가장 마지막에 아래 명령을 추가하면 됩니다.

```
*/1 * * * * /home/ubuntu/ssh-count.sh
```

### 확인

CloudWatch - Metrics 에서 Custom Namespaces 항목의 EC2 - InstanceId 에서 확인 할 수 있습니다.

## EC2 자동 종료

이제 일정 시간 내에 SSH 연결 수가 0이면, EC2를 자동으로 종료되도록 만들어 볼 것입니다.

### CloudWatch Alarm 설정

CloudWatch - Alarms 에서 Create alarm 을 눌러서 Alarm을 만듭니다.

### Specify metric and conditions

이 화면에서는 사용할 Metric의 선택과 설정을 할 수 있습니다.

#### Metric

Select Metric 을 눌러서 방금 만든 Metric을 선택하고, Statistic와 Period를 확인합니다.

Period의 기간내의 수집된 Metric을 Statistic에서 설정한 방법대로 통계내서 확인하게 되므로, 1분 간격의 데이터를 전부 보기 위해 Period를 1분으로 설정하였습니다.

#### Conditions

Threshold type는 Static, Whenever는 Lower/Equal, than은 0로 설정해서 값이 0이하이면 Alarm이 되도록 하였습니다.

> ![Threshold](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\threshold.png)

#### Additional configuration

0이하로 되자마자 Alarm이 되지 않도록 Datapoints to alarm을 설정하였습니다.

> ![Datapoints to alarm](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\datapoints-to-alarm.png)

최근 15갯수내에서 0이하가 15개 이면 Alarm이 되도록 하였습니다. Period를 1분으로 설정했으니, 15분 동안 계속 0이하이면 Alarm이 되는 셈이죠.

### Configure actions

이 화면에서는 상태에 따라 취할 Action을 설정합니다.

#### Notification

AWS SNS로 알림을 보낼 생각이 있으면, 설정합니다.

하지 않을 생각이면, Remove를 눌러주세요.

#### EC2 action

EC2에 종료 명령을 내릴 수 있게 할 수 있습니다.

아래처럼 Alarm의 경우에 Stop this instance 을 하도록 설정해 주었습니다.

> ![Stop this instance](\assets\images\2019-12-01-stop-ec2-when-no-ssh-connection-for-a-while\stop-this-instance.png)

그리고, 나머지는 적당히 입력해서 완성했습니다.

### 확인

CloudWatch - Alarms 에서 확인이 가능합니다.

종료 할 때에는 ALARM, 종료 후 시간이 지나면 INSUFFICIENT, 실행 중일 때에는 OK 로 변하는 것을 볼 수 있을 것입니다.

## 한계

- 매우 짧은 연결

1분 마다 현재 실행중인 SSHD를 세어서 보내기 때문어, 샘플링 주기의 사이에 실행되고 종료되는 SSHD가 있다면, 기록 되지 않을 것입니다.

이러한 연결이 의미가 있는 연결일 것이라고 생각 되지 않기에, 별 문제는 없어보입니다.

연결이 될 때 `put-metric-data`를 실행하도록 하면 해결이 되기도 하죠.

- 연결이 없어도 기다리는 SSHD

사용하지 않고 있더라도 SSHD가 바로 종료되는 것은 아니기에, 정확한 연결 수를 얻어내려면 추가적인 설정이 필요로 할 듯 합니다. [`ClientAliveInterval이랑 ClientAliveCountMax`](https://linux.die.net/man/5/sshd_config)와 같은 설정으로 말이죠.

- 종료 직전에 SSH 연결

SSH 연결 수를 전송하고 Alarm에서 감지하여 종료되기 사이에 새로운 접속이 있을 경우를 생각해 볼 수 있는데, 접속하자마자 종료가 될 듯하므로, 문제는 없을 듯 합니다.

## 소감

Cloud9으로만 사용할 생각이면, Cloud9에서 EC2를 만드는 것이 Cloud9에 맞춰서 자동 종료가 되기에 좋습니다.

다만, 자동 종료 기능은 Cloud9을 종료하고 일정 시간 뒤에 EC2가 종료 되기 때문에, Cloud9을 쓰고 있지 않을 때도 사용할 경우가 있다면 자동 종료 기능을 꺼야 하므로 직접 구축한 EC2와 큰 차이가 없게 됩니다.

또는, EC2를 수동으로 구축한 경우도 생각해볼 수 있습니다.

이런 경우에도 자동으로 종료 시키는 것은 가능하다는 것을 알았습니다.

이 글의 방법에서 *SSH의 연결 수를 알아내어 전송*하는 부분을 변경하면 다른 상황에서도 사용 할 수 있을듯 합니다.
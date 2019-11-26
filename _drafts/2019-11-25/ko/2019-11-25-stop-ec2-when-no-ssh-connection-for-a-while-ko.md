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

EC2에서 실행되는 스크립트 만으로도 가능할 듯 하지만, AWS에서 모니터링도 가능하게 하고 싶어서 CloudWatch를 이용하였습니다.

## IAM User 작성

CloudWatch로 데이터를 보내는 역할을 하는 User가 필요합니다.

AWS CLI에서 접속이 가능하고 권한은 CloudWatchAgentServerPolicy을 가진 User를 생성하였습니다.

> ![user-permission](\assets\images\2019-11-25-stop-ec2-when-no-ssh-connection-for-a-while\user-permission.png)

## EC2에 aws cli 설정

CloudWatch로 데이터를 보내기 위해서 EC2에 aws cli를 설치하고, 위에서 만든 User를 설정해줍니다.

### 설치

이미 설치 되어 있다면, User설정만 하면 됩니다.

[Install the AWS CLI version 1 on Linux](https://docs.aws.amazon.com/cli/latest/userguide/install-linux.html)

### User 설정

방금 만든 User로 설정해줍니다.

[Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

## SSH 연결 수 알아내기

보낼 데이터의 값으로 현재 연결된 SSH의 수를 알아내어서 보낼 생각입니다.

### 연결 되어 있는 user를 알아내는 방법

```
who
```

해당 명령어로 현재 접속되어 있는 사용자를 알아 낼 수 있습니다.

SSH로 접속했을 경우 아래와 같이 확인할 수 있습니다.

![SSH-User]()

다만, Cloud9로 접속했을 경우, 아무것도 나오지 않는 것을 확인 할 수 있습니다.

![Cloud9-User]()

### Cloud9의 연결은 확인 되지 않음

왜 일까요?

[SSH Host Requirements](https://docs.aws.amazon.com/cloud9/latest/user-guide/ssh-settings.html#ssh-settings-requirements)을 보면 SSH의 접속 가능이 요구되어 있어서 SSH를 이용하는 것은 알 수가 있습니다.

다만, AWS Cloud9 Installer 의 실행으로 추가적인 plugin이 필요한 것으로 보아 무언가 다른 것이 있을 수 있다는 느낌이 옵니다.

### 현재 실행 중인 SSHD의 갯수로 알아내기

SSH로 연결은 하는 것 같으니까, 실행 중인 SSHD를 알아봅시다.

```
ps -A x | grep "sshd"
```

실행 중인 프로세스 중에 sshd 를 포함하는 프로세스만 추려보았습니다.

[sshd-list]()

`sshd: ubuntu [priv]`과 `sshd: ubuntu@notty`이 각각 2개씩, 4개가 보이네요. 

SSH로 접속할 때 보안 강화의 방법으로 priv 로 프로세스를 만든다음, 자식 프로세스를 만들어서 처리시킨다고 하네요.

그래서 한 개의 SSH 접속에 2개의 프로세스가 만들어 진다고 합니다.

그럼 현재 2개의 SSH 연결이 있다는 것을 알 수 있네요. 

다음 명령으로 SSH 연결 수를 알아냅시다.

```
ps -A x | grep "sshd" | grep "\\[priv\\]" | wc -l
```

## SSH 연결 수 전송

알아낸 SSH 연결 수를 CloudWatch에 전송하도록 합니다.

```
put-metric-data
--namespace <value>
--dimensions <value>
--metric-name <value>
--value <value>
--timestamp <value>
```

### [put-metric-data](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-metric-data.html)

aws cli를 이용하여 CloudWatch에 Metric을 보내는 명령어 입니다.

보낸 데이터를 시간 단위로 기록하게 되고, 이것으로 시간의 경과에 따른 데이터의 변화를 살펴 볼 수 있게 됩니다.

#### demension

보내는 데이터의 상세 정보와 같은 느낌으로 설정할 수 있습니다.

다만, 자동 종료로 사용하는 CloudWatch의 Alarm이 EC2를 대상으로 할 때만 종료가 가능하도록 되어 있기 때문에, 여기서는 `InstanceId` 를 입력해야 합니다.

#### value

보내는 데이터의 값 입니다.

### crontab

일정 주기로 반복 시키기 위해서 사용하였습니다.

### 확인

## EC2 자동 종료

이제 일정 시간 내에 SSH 연결 수가 0이면, EC2를 자동으로 종료되도록 만들어 볼 것입니다.

### CloudWatch Alarm 설정

### 확인

## 한계

샘플링 주기의 사이에 잠깐 접속 되고 종료되는 SSH가 있다면, 기록 되지 않을 것입니다.

## 소감
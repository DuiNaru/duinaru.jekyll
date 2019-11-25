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
주로 Cloud9으로 사용하는 EC2가 SSH 연결이 없을 때는 사용할 일이 없어서, 일정 시간 대기 한 뒤에 자동 종료가 되도록 만들어 보았습니다.

EC2에서 실행되는 스크립트 만으로도 가능할 듯하나, AWS에서 모니터링도 가능하게 하고 싶어서 CloudWatch를 이용하였습니다.

## IAM User 작성

AWS에서 모니터링 하는 방법으로 CloudWatch를 이용하였습니다.

그러므로, CloudWatch로 데이터를 보내는 역할을 하는 User가 필요합니다.

## EC2에 aws cli 설정

CloudWatch로 데이터를 보내기 위해서 aws cli를 설치하고, 위에서 만든 User를 설정해둡니다.

## SSH 연결 수 알아내기

보낼 데이터의 값으로 현재 연결된 SSH의 수를 알아내어서 보낼 생각입니다.

### 연결 되어 있는 user를 알아내는 방법

### Cloud9의 연결은 확인 되지 않음

### 현재 실행 중인 SSHD의 갯수로 알아내기

## SSH 연결 수 전송

알아낸 SSH 연결 수를 일정간격으로 CloudWatch에 전송하도록 합니다.

### put-metric

aws cli를 이용하여 CloudWatch에 Metric을 보내는 명령어 입니다.

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
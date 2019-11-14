---
title: ruby on rails를 ec2에 구축해보았습니다
layout: single
author_profile: true
comments: true
share: true
related: true
lang: ko
permalink: "/:categories/:year/:month/:day/set-up-ruby-on-rails-ec2"
---

ruby를 알게 되었으니 ruby를 이용한 웹 사이트 한번 만들어보고싶어서  ruby on rails로 개발을 시작하였습니다.

개발을 하면서 동시에 ruby on rails를 익히려는 목적이므로 기본적인 환경 구축부터 시작하였습니다.

## EC2 생성

**AMI**

편하게 ubuntu(Ubuntu Server 18.04 LTS (HVM), SSD Volume Type)를 선택하였습니다.

나머지 설정은 free-tier 가능한 설정으로 생성했습니다.

**Security groups**

SSH 접속 가능하게 22포트는 열어두고, 나머지는 나중에 설정하면서 열어주었습니다.

*클릭 몇 번에 생성이 끝났습니다. 고마워요. AWS*

## 설치

SSH로 접속해서, 차근차근 설치를 진행합니다.

[Ruby on Rails](https://rubyonrails.org/) 의 [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html) 를 바탕으로 진행하였습니다.

### 패키지 업데이트

```
sudo apt-get update
```

### Ruby 설치

```
sudo apt-get install ruby-full
```

### Ruby 버전 확인
```
ruby -v
```
rails에서 요구하는 ruby 2.5.0이후 버전인지 확인합니다.
>![ruby -v](\assets\images\2019-11-14-set-up-ruby-on-rails-ec2\ruby-v.png)
>

2.5.대 버전이군요.

### sqlite3 설치
```
sudo apt-get install sqlite3
```

### sqlite3 버전 확인
```
sqlite3 --version
```

### rails 설치
드디어 rails를 설치할 차례입니다.
```
sudo gem install rails
```

### 설치 에러

> ![Error on installing rails about nokogiri](\assets\images\2019-11-14-set-up-ruby-on-rails-ec2\error_nokogiri.png)
> `Could not create Makefile due to some reason, probably lack of necessary libraries and/or headers.`

설치 중간에 에러가 나왔습니다. Nokogiri 에서 일부 라이브러리가 없어서 생기는 에러 같군요.

[Nokogiri 홈페이지](https://nokogiri.org/)에서 해결법을 찾아봅시다.

[install-with-system-libraries](https://nokogiri.org/tutorials/installing_nokogiri.html#install-with-system-libraries)처럼 설치하니 되는 군요.
```
sudo apt-get install pkg-config
```
rails 설치를 계속 합니다.

### rails 버전 확인
```
rails --version
```

>![rails --version](\assets\images\2019-11-14-set-up-ruby-on-rails-ec2\rails--version.png)

드디어 설치 완료했습니다. 중간에 에러 나서 당황했네요.

다음엔, [Creating the Blog Application](https://guides.rubyonrails.org/getting_started.html#creating-the-blog-application)으로 메인 화면까지 띄우도록 해보겠습니다.
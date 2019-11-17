---
title: Rails 화면 띄우기 및 Cloud9 사용
layout: single
author_profile: true
comments: true
share: true
related: true
category: programming
tags: [rails, aws, cloud9]
lang: ko
permalink: "/:year/:month/:day/develop-using-cloud9"
---

샘플 화면 하나를 띄우고, 본격적인 개발에 앞서 IDE를 사용하기로 하였습니다.

## blog 생성

blog라는 이름의 rails 어플을 생성하였습니다.
```
rails new blog
```
해당 명령어로 미리 설정되어 있는 blog 어플리케이션을 가져와서 다운로드한다네요.


## 에러 발생

설치는 되었는데, 중간에 에러가 나왔네요. 역시 한번에 되는건 없나봅니다.

```
Gem::Ext::BuildError: ERROR: Failed to build gem native extension.
current directory: /tmp/bundler20191116-12860-iie6sqlite3-1.4.1/gems/sqlite3-1.4.1/ext/sqlite3
/usr/bin/ruby2.5 -r ./siteconf20191116-12860-3nvvhf.rb extconf.rb
checking for sqlite3.h... no
sqlite3.h is missing. Try 'brew install sqlite3',
'yum install sqlite-devel' or 'apt-get install libsqlite3-dev'
and check your shared library search path (the
location where your sqlite3 shared library is located).
*** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.
```

sqlite3 1.4.1가 제대로 설치되지 않았다고 나옵니다.

`gem install sqlite3 -v '1.4.1'`을 해보니 마찬가지로 에러가 나와서 다음 명령어로 해결하였습니다.

```
sudo apt-get install libsqlite3-dev
sudo gem update
bundle install
```

잘 설치되었습니다. rails를 한번 실행해봐야 곘네요.

```
rails server
```

## 또, 에러

에러가 나오는 군요.

```
/var/lib/gems/2.5.0/gems/webpacker-4.2.0/lib/webpacker/configuration.rb:95:in `rescue in load': Webpacker configuration file not found /home/ubuntu/blog/config/webpacker.yml.
Please run rails webpacker:install Error: No such file or directory @ rb_sysopen - /home/ubuntu/blog/config/webpacker.yml (RuntimeError)
```

webpacker을 설치해달라는 군요.

우선, node.js를 설치해줍니다. 이후 yarn을 설치하고, webpacker를 설치했습니다.

```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
rails webpacker:install
```

설치가 되었습니다. rails 서버도 기동하는 군요.

> ![rails server](\assets\images\2019-11-16-develop-using-cloud9\rails-server.png)

## 접속해보기

로컬 환경이였다면, `127.0.0.1:3000`으로 접속이 가능했겠지만, ec2라서 살짝 설정을 바꿔주었습니다.

### 포트를 80 을 접속 가능하도록 Security Group 설정 변경

EC2의 Security Group의 Inbound에 80포트를 설정해주었습니다.

### 0.0.0.0:80 으로 서버 기동

```
rails server -b 0.0.0.0 -p 80
```

### 접속

EC2의 공인 ip로 접속해보았습니다.

> *서버 실행 중*
> ![rails server -b 0.0.0.0 -p 80](\assets\images\2019-11-16-develop-using-cloud9\rails-server-80.png)
>
> *메인 화면*
> ![main page](\assets\images\2019-11-16-develop-using-cloud9\success.png)

드디어 메인 화면이 나왔습니다. 이제부터는 본격적인 개발이 될 듯 하네요.

## Cloud9 설정

그 전에, IDE를 설정했습니다.

SSH 접속으로 설정하면 어떤 IDE도 사용할 수 있으나, AWS에 만들어 봤으니, IDE도 AWS를 사용해보았습니다.

Cloud9은 EC2로 처음부터 바로 환경 구축을 할 수도 있지만, 이번에는 미리 만든 EC2가 있으니 만들어 둔 EC2를 사용하였습니다.

[Creating an SSH Environment](https://docs.aws.amazon.com/ko_kr/cloud9/latest/user-guide/create-environment-ssh.html)

앞으로 계속 같은 ip 접속하기 위해 elastic ip을 할당하고, 위의 도움말에서 `~/.ssh/authorized_keys`를 만드는 과정을 했습니다.

이후, AWS Cloud9 Installer가 실행되어서 이것저것 설치되었습니다.

> ![AWS Cloud9 Installer](\assets\images\2019-11-16-develop-using-cloud9\AWS-Cloud9-Installer.png)

설치가 끝난 다음, 하단의 bash에 `rails server -b 0.0.0.0 -p 80`으로 서버를 실행하고 접속 할 수 있었습니다.

이제 본격적으로 개발을 할 수 있겠네요.
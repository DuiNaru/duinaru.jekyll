---
title: ruby on railsをec2に実装してみました。
layout: single
author_profile: true
comments: true
share: true
related: true
category: programming
tags: [rails, aws, ec2]
lang: ja
permalink: "/:year/:month/:day/set-up-ruby-on-rails-ec2"
---

rubyを知りましたので、rubyでウェブサイトを開発したくてruby on railsを始めました。

開発しながらruby on railsを学習する目的で、環境構築から始めました。

## EC2 生成

**AMI**

ubuntu(Ubuntu Server 18.04 LTS (HVM), SSD Volume Type)を選びました。

他の設定はfree-tierができるようにしました。

**Security groups**

SSHができるように22ポートは可能にし、他はその時に解放します。

## インストール

SSHで接続し、インストールします。

[Ruby on Rails](https://rubyonrails.org/) の [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html) を元に進めました。

### パッケージアップデート

```
sudo apt-get update
```

### Ruby インストール

```
sudo apt-get install ruby-full
```

### Ruby バージョン確認
```
ruby -v
```
railsで要求されるruby 2.5.0の以降のバージョンか確認します。
>![ruby -v](\assets\images\2019-11-14-set-up-ruby-on-rails-ec2\ruby-v.png)
>

2.5.xですね。

### sqlite3 インストール
```
sudo apt-get install sqlite3
```

### sqlite3 バージョン確認
```
sqlite3 --version
```

### rails インストール
```
sudo gem install rails
```

###  インストールのエラー

> ![Error on installing rails about nokogiri](\assets\images\2019-11-14-set-up-ruby-on-rails-ec2\error_nokogiri.png)
> `Could not create Makefile due to some reason, probably lack of necessary libraries and/or headers.`

インストールの途中でエラーが発生しました。Nokogiriで一部のライブラリがなくて出るエラーのようですね。

[Nokogiri Homepage](https://nokogiri.org/)で解決策を探してみましょう。

[install-with-system-libraries](https://nokogiri.org/tutorials/installing_nokogiri.html#install-with-system-libraries)のようにしたらできました。
```
sudo apt-get install pkg-config
```
rails のインストールを続きます。

### rails バージョン確認
```
rails --version
```

>![rails --version](\assets\images\2019-11-14-set-up-ruby-on-rails-ec2\rails--version.png)

やっとインストール完了です。

次は[Creating the Blog Application](https://guides.rubyonrails.org/getting_started.html#creating-the-blog-application)でメイン画面まで進んでみます。
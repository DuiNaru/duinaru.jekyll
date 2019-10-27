---
title: 開発と経験があるブログ
layout: single
author_profile: true
comments: true
related: true
lang: ja
permalink: "/:categories/:year/:month/:day/blog-with-development-and-experience"
---

普段考えていた色々なものを書こうとブログを作ることにしました。

ブログを運営するならブログサービスを利用した方が簡単で便利だろうと思っていた時にgithub.ioというドメインを見つけました。

結果としては、github pagesで実装しました。

# 必要な物

**github**

github pagesをサービスするrepositoryを作りました。

**jekyll**

github pagesはjekyllをサポートします。

jekyllで作ったソースをrepositoryに置いておくだけでビルド-デプロイをしてくれます。

**ruby**

jekyllで作るにはrubyが必要です。

buildをしたり、pluginをインストールして機能を追加することができます。

# 作る

**ruby**

jekyllのbuildと様々なpluginを利用するためにインストールしました。

jekyllの公式ホームページに手順があり、便利でした。

**マルチランゲージ**

少なくとも2ヶ国語で運営することを目指してしていまして、マルチランゲージのサポートのため[polygot plugin](https://polyglot.untra.io/)を使用しました。

このプラグインはgithub pagesで公式的にサポートするプラグインではありませんので、単純にrepositoryにソースを置いておくことだけでビルドはできません。

でも、対策はあるでしょう。

**テーマ**

テーマを選ぶことに時間がかなりかかりました。

これにしようかあれにしようかとしたら時間があっという間に過ぎました。

結局は[Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)にすることにしました。

しかし、ここで問題が発生しました。

> buildの時、エラーが出ます。
> 
> polyglot pluginが動かないです。
> 

# 問題解決

**windows環境でbuildの時、文字関連エラーの解決**

rubyをwindowsの環境で使おうとしたら出るエラーでした。

> ![ビルドエラー](\assets\images\2019-10-23-blog-with-development-and-experience\build-error.png)
> 

vscodeからcmdでビルドしていたので、`chcp 65001` でUTF-8に変えて解決しました。

他には、jekyllをエラーが出ないバージョンに変更する方法もありますが、下記の問題でバージョンを制限するしかありませんでした。

**Minimal Mistakesとpolygot pluginを共に使用**

ウェブページを正常に作れない問題が出ました。

これについては色々トライし、次のように解決できました。

*jekyllバージョン制限*

jekyllのバージョンを3.8.6としたら、polygot pluginと共に動きました。

*polyglot pluginの_config.xml設定*

> ![polyglot setting](\assets\images\2019-10-23-blog-with-development-and-experience\polyglot-setting.png)
> 

languagesの言語の一番目をdefault_langに設定したらpolygot pluginがうまく動きました。

# 機能追加

**言語セレクタ**

マルチランゲージのサポートのため、言語を変更する機能を追加しました。

ページの下にあるJAやKOなどのものです。

**コメント**

Minimal Mistakesで提供する[disqus](https://disqus.com/)を利用し、実装しました。

# 感想

多様な機能を実現してかなり時間が過ぎました。

これからはポストも作成しつつ、また新しい機能を追加していきたいと思います。
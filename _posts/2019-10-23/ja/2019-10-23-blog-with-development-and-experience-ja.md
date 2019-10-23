---
title: 開発と経験があるブログ
lang: ja
permalink: "/:categories/:year/:month/:day/blog-with-development-and-experience"
---

普段、考えていた色々なものを書こうとブログを作ることにしました。

ブログを運営しようとしたらブログサービスを利用する方が簡単で便利そうでしたが、github.ioというドメインが目立ちました。

それで、github pagesで作ることにしました。

# 必要な物

**github**

github pagesをサービスするrepogitoryを作りました。

**jekyll**

github pagesはjekyllをサポートします。

jekyllのソースをrepogitoryに置いておくだけでビルド-デプロイをしてくれます。

**ruby**

jekyllで作るにはrubyが必要です。

buildをしたり、pluginをインストールして機能を追加することができます。

# 作る

**ruby**

jekyllのbuildと色々なpluginを利用するためにインストールしました。

jekyllの公式ホームページに手順があり、便利でした。

**マルチランゲージ**

二つ以上の言語で運営することを目指してしていまして、マルチランゲージのサポートのため[polygot plugin](https://polyglot.untra.io/)を使用しました。

このプラグインはgithub pagesで公式的にサポートするプラグインではありませんので、単純にrepogitoryにソースを置いておくことだけでビルドはできません。

しかし、方法はありました。

**テーマ**

テーマを選ぶことに時間がかなりかかりました。

これにしようかあれにしようかとしたら時間があっという間に過ぎました。

結局は[Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)にすることにしました。

しかし、ここで問題が出ました。

> buildの時、エラーが出ます。
> 
> polygot pluginが動かないです。
> 

# 問題解決

**windows環境でbuildの時、文字関連のエラー解決**

rubyをwindowsの環境で使おうとしたら出るエラーでした。

> ![ビルドエラー](\assets\images\2019-10-23-blog-with-development-and-experience\build-error.png)
> 

vscodeからcmdでビルドしていたので、chcp 65001 でUTF-8に変えて解決しました。

また、jekyllをエラーが出ないバージョンに変更する方法もありますが、下記の問題でバージョンを制限しました。

**Minimal Mistakesとpolygot pluginを共に使用**

ウェブページを正常に作れない問題が出ました。

繰り返して試し、次のように解決できました。

*jekyllバージョン制限*

jekyllのバージョンを3.8.5としたら、polygot pluginと共に動きました。

*polyglot pluginの_config.xml設定*

> ![polyglot setting](\assets\images\2019-10-23-blog-with-development-and-experience\polyglot-setting.png)
> 

languagesの言語の順番をdefault_langで設定した言語を先にするとpolygot pluginがうまく動きました。

# 機能追加

**言語セレクタ**

マルチランゲージのサポートのため、言語を変更する機能を追加しました。

ページの下に見えるJAやKOなどのものです。

**コメント**

Minimal Mistakesでサポートする[disqus](https://disqus.com/)を利用し、追加しました。

# 感想

作るうちにかなり時間が過ぎました。

これからは色々書くかアップデートしようと思います。
---
title: GitHub PagesでサポートされないPluginを使う方法
layout: single
author_profile: true
comments: true
related: true
category: programming
tags: [jekyll, ruby]
lang: ja
permalink: "/:year/:month/:day/how-to-make-a-github-pages-work-with-an-unsupported-plugin"
---

jekyllを公式的にサポートするGitHub Pagesですが、全てのjekyllのpluginまでサポートすることではありません。

GitHub Pagesは[サポートするplugin](http://pages.github.com/versions/)が制限されています。

これ以外のpluginはGitHub Pagesでjekyllをbuildする時、制限されて適用されません。

では、GitHub Pagesでjekyllを使って、ウェブページサービスを作る時は一部のpluginだけ使用しなければならないでしょうか。

半分は正しく、半分は違います。

なぜか調べるまえにGitHub Pagesがどのようにjekyllを使うか調べましょう。

**GitHub Pages with jekyll source**

Github Pagesでjekyllを使う簡単な方法です。

[公式ヘルプ](https://help.github.com/en/github/working-with-github-pages/setting-up-a-github-pages-site-with-jekyll)でも説明する方法のように、jekyllのソースをrepositoryに上げておいてGitHub Pagesがjekyllをbuildする方法です。

GitHub Pagesで問題なく使用可能なpluginで制限され、pluginの互換性などの問題についてあまり気を使わなく作ることができるいいところがあります。

**GitHub Pages without jekyll source**

GitHub Pagesは基本的に静的ウェブページホスティングサービスですので、jekyllのソースではなくウェブファイルだけあってもサービスが可能です。

つまり、何で作ったとしても、サービスに必要なファイルだけあれば問題ないということです。

このようなファイルはjekyllでbuildした時に\_siteのディレクトリの中に出来上がるので、このファイルを直接GitHub Pagesのrepositoryに上げても問題なくサービスできます。

*GitHub PagesでサポートしないjekyllのPluginで作ったファイルも例外ではありません。*

# GitHub Pages with an unsupported plugin

サポートされないpluginでもローカルでbuildした後、ファイルを上げればサービスが可能になります。

このためには先ずはどのbranchがGitHub Pagesに設定されているか確認する必要があります。

repositoryのsettingsにGitHub Pagesという項目があります。

> ![GitHub Pages Settings](\assets\images\2019-10-26-how-to-make-a-github-pages-work-with-an-unsupported-plugin\settings-github-pages.png)
> 

筆者の場合はmaster branchを使用中ということを確認できました。

ですので、master branchにjekyllでbuildしたファイルを上げておけば、GitHub Pagesをサービスすることができるようになります。

**ソースとファイルを分けて、管理**

master branchにbuildしたファイルを上げたら、ソースは分けて上げたくなりました。

それでsourcesというbranchを作り、ソースは該当のbranchにpushするとことにしました。

しかし、buildされたファイルはmaster branchにpushしなければならないので、都度branchを変更してpushする面倒なことになりました。

これを全て手作業でしたら、ミスも出るし、面倒なので、下のような*PowerShell Script*を作って自動化しました。

*PowerShell Script*
```
chcp 65001
$env:JEKYLL_ENV = 'production'
rm -r _site/*
git clone -b master https://github.com/DuiNaru/duinaru.github.io.git _site
bundle exec jekyll build
cd _site
git add -A
git commit -am 'jekyll build'
git push
```

[build時、エラー](/2019/10/23/blog-with-development-and-experience#%E5%95%8F%E9%A1%8C%E8%A7%A3%E6%B1%BA)を解決するための`chcp 65001`とjekyllをproduction環境でbuildするための`$env:JEKYLL_ENV = 'production'`が含まれています。

jekyllをproduction環境でbuildをして上げる理由については次に説明します。

これで、GitHub Pagesがサポートしないpluginでもサービスが可能になりました。
---
title: Github Pagesでブログつくり
layout: single
author_profile: true
read_time: true
comments: true
related: true
permalink: "/:categories/:year/:month/:day/make-blog-with-github-pages"
lang: ja
---

私のホームページを持ちたいと考えたことはありませんか。

ブログサービスを利用し、ブログを運営してみることも、ウェブホスティングや自作サーバでウェブサービスを創り、運営してみる方法もあります。

筆者も考えているうちにGithub Pagesを知り、創ってみました。
# Github Pages

Github Pagesといつ単語を初めに聞いたときは半分くらいは分かっている感じでした。

*Githubは聞いたことがあるが, Pagesは何？*

[Github Pages](https://pages.github.com/)はGithubが提供するウェブページサービスです。

Git repogitoryをウェブページサービスとして利用することができるようです。

*git repogitoryをウェブサービスに?*

Github Pagesはrepogitoryに保存されているファイルをURLにマッピングし、ブラウザからアクセス可能にしてくれます。

主なURLは次のようになっています。

> https://[username].github.io/
> 

Github Pagesに設定されたrepogitoryにあるhtmlファイルもURLでアクセス可能になります。

つまり、repogitoryにhtmlを入れておくことだけでも、誰でもウェブページを見ることが可能になります。

# index.htmlを作ってみましょう

HTMLを作って、確認してみましょう。

**Github Page用repogitory作成**

ウェブページを入れるrepogitoryが必要です。

[Github](https://github.com/)にログインし、repogitoryを作りましょう。

> ![repogitory作成](/assets/images/2019-10-23-make-blog-with-github-pages/create-repogitory.png)
> 

usernameはGithub IDを入れて, Create repogitoryをクリックすると作成できます。

**index.htmlをrepogitoryに追加**

repogitoryにファイルを追加する方法は色々ろいろありますが、今回はGithub.comで作ってみましょう。

作ったrepogitoryでcreate new fileのボタンを押しましょう。

> [Creating new files](https://help.github.com/en/github/managing-files-in-a-repository/creating-new-files)
> 

上記の [Creating new files](https://help.github.com/en/github/managing-files-in-a-repository/creating-new-files)のようにすれば作ることができます。

ファイル名はindex.html、ファイルの内容は次のように入力してみましょう。

```
<!DOCTYPE html>
<html>
<body>
<h1>Hello World</h1>
<p>I'm hosted with GitHub Pages.</p>
</body>
</html>
```

ファイルを作った後、repogitoryにindex.htmlがあることは確認できます。

確認できたら、ブラウザのURLにrepogitoryの名前を入れてみましょう。

> ![index.html](\assets\images\2019-10-23-make-blog-with-github-pages\index.png)

画像のような画面を確認できます。

次にはindex.htmlのようなhtmlをより簡単に作成できる静的サイトジェネレーターについて調べてみます。
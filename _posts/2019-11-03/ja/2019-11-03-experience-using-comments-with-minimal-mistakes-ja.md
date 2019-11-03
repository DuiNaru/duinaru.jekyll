---
title: ブログにコメント機能を追加しました
layout: single
author_profile: true
comments: true
share: true
related: true
lang: ja
permalink: "/:categories/:year/:month/:day/experience-using-comments-with-minimal-mistakes"
---

使用しているMinimal Mistakes テーマは多様なコメントサービスを使えるように[設定](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#comments)できて、使いました。

コメントを追加するページに`comment: true`を追加し、`_config.xml`には使用するサービスの情報を入力すればできます。

筆者はdisqusというコメントサービスを使ってみました。

[disqus](https://disqus.com/)に会員登録してサイトを[生成](http://disqus.com/admin/create)し、[ShortName](https://help.disqus.com/en/articles/1717111-what-s-a-shortname)を分かればできます。 

shortnameはサイトを生成する時や、生成した後に設定ページでも分かります。

>[site生成](http://disqus.com/admin/create)
>  ![shortname](\assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\create-site.png)
> 

>[site設定](https://disqus.com/admin/settings/general/)
>  ![shortname](/assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\shortname.png)
> 

後は`_config.xml`に[設定](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#disqus)すればできます。

会員登録と使用設定すれば終わるので、簡単ですね。

確認してみましょう。

> 出ない。
> 

**理由を探してみましょう。**

おかしいです。どう見ても今までの設定でできそうです。

それで、Minimal Mistakesでdisqusと関係したcommentのソースコードを探してみました。

> \_includes\comments.html
> ![comments.html](/assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\comments.png)
> 

disqusのためにsectionを作っていることが確認できます。

それで、該当のhtmlをincludeしているファイルを探してみました。

> \_layouts\single.html
> ![single](\assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\single.png)
> 

singleのレイアウトページの一部です。

何かの条件でincludeをしていることが確認できます。

`site.comments.provider`は`_config.xml`で設定し、`page.comments`は`true`に設定しておきました。

> jekyll.environment == 'production'は？
> 

あ、Minimal Mistakes  [comment設定](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#comments)のNoteがこの内容のようですね！

# jekyllをproduction環境でbuildする

[jekyll build オプション](https://jekyllrb.com/docs/configuration/options/#build-command-options)で[Environment](https://jekyllrb.com/docs/configuration/environments/)を設定できます。

コードからは`jekyll.environment`で読み取れ、buildの設定に分けて異なる結果物を作ることができるようになります。

Minimal Mistakesはproductionでbuildした場合のみ、commentを使用できるようにしてありますので、buildの時にEnvironmentをproductionに設定しなければなりません。

GitHub Pagesでbuildする場合なら、自動的にproductionに設定されてbuildされますが、筆者はlocalでbuildをしているので設定する必要がありました。

linuxの環境でしたら、[Environment](https://jekyllrb.com/docs/configuration/environments/)で説明しているようにすればいいですが、windowsなら別です。

*cmdの場合*
```
set JEKYLL_ENV=production
```

*powershellの場合*
```
$env:JEKYLL_ENV = 'production'
```

上記のコマンドを実行した後にbuildやserveをしたら、productionで作られます。

これで、Minimal Mistakesにコメント機能を追加することができました。
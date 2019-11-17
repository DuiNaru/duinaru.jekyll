var store = [{
        "title": "開発と経験があるブログ",
        "excerpt":"普段考えていた色々なものを書こうとブログを作ることにしました。   ブログを運営するならブログサービスを利用した方が簡単で便利だろうと思っていた時にgithub.ioというドメインを見つけました。   結果としては、github pagesで実装しました。   必要な物   github   github pagesをサービスするrepositoryを作りました。   jekyll   github pagesはjekyllをサポートします。   jekyllで作ったソースをrepositoryに置いておくだけでビルド-デプロイをしてくれます。   ruby   jekyllで作るにはrubyが必要です。   buildをしたり、pluginをインストールして機能を追加することができます。   作る   ruby   jekyllのbuildと様々なpluginを利用するためにインストールしました。   jekyllの公式ホームページに手順があり、便利でした。   マルチランゲージ   少なくとも2ヶ国語で運営することを目指してしていまして、マルチランゲージのサポートのためpolyglot pluginを使用しました。   このプラグインはgithub pagesで公式的にサポートするプラグインではありませんので、単純にrepositoryにソースを置いておくことだけでビルドはできません。   でも、対策はあるでしょう。   テーマ   テーマを選ぶことに時間がかなりかかりました。   これにしようかあれにしようかとしたら時間があっという間に過ぎました。   結局はMinimal Mistakesにすることにしました。   しかし、ここで問題が発生しました。      buildの時、エラーが出ます。     polyglot pluginが動かないです。     問題解決   windows環境でbuildの時、文字関連エラーの解決   rubyをwindowsの環境で使おうとしたら出るエラーでした。           vscodeからcmdでビルドしていたので、chcp 65001 でUTF-8に変えて解決しました。   他には、jekyllをエラーが出ないバージョンに変更する方法もありますが、下記の問題でバージョンを制限するしかありませんでした。   Minimal Mistakesとpolyglot pluginを共に使用   ウェブページを正常に作れない問題が出ました。   これについては色々トライし、次のように解決できました。   jekyllバージョン制限   jekyllのバージョンを3.8.6としたら、polyglot pluginと共に動きました。   polyglot pluginの_config.xml設定           languagesの言語の一番目をdefault_langに設定したらpolyglot pluginがうまく動きました。   機能追加   言語セレクタ   マルチランゲージのサポートのため、言語を変更する機能を追加しました。   ページの下にあるJAやKOなどのものです。   コメント   Minimal Mistakesで提供するdisqusを利用し、実装しました。   感想   多様な機能を実現してかなり時間が過ぎました。   これからはポストも作成しつつ、また新しい機能を追加していきたいと思います。  ","categories": ["programming"],
        "tags": ["jekyll","ruby"],
        
        "url": "https://duinaru.github.io/ja/2019/10/23/blog-with-development-and-experience",
        
        "teaser":null},{
        "title": "GitHub PagesでサポートされないPluginを使う方法",
        "excerpt":"jekyllを公式的にサポートするGitHub Pagesですが、全てのjekyllのpluginまでサポートすることではありません。   GitHub Pagesはサポートするpluginが制限されています。   これ以外のpluginはGitHub Pagesでjekyllをbuildする時、制限されて適用されません。   では、GitHub Pagesでjekyllを使って、ウェブページサービスを作る時は一部のpluginだけ使用しなければならないでしょうか。   半分は正しく、半分は違います。   なぜか調べるまえにGitHub Pagesがどのようにjekyllを使うか調べましょう。   GitHub Pages with jekyll source   Github Pagesでjekyllを使う簡単な方法です。   公式ヘルプでも説明する方法のように、jekyllのソースをrepositoryに上げておいてGitHub Pagesがjekyllをbuildする方法です。   GitHub Pagesで問題なく使用可能なpluginで制限され、pluginの互換性などの問題についてあまり気を使わなく作ることができるいいところがあります。   GitHub Pages without jekyll source   GitHub Pagesは基本的に静的ウェブページホスティングサービスですので、jekyllのソースではなくウェブファイルだけあってもサービスが可能です。   つまり、何で作ったとしても、サービスに必要なファイルだけあれば問題ないということです。   このようなファイルはjekyllでbuildした時に_siteのディレクトリの中に出来上がるので、このファイルを直接GitHub Pagesのrepositoryに上げても問題なくサービスできます。   GitHub PagesでサポートしないjekyllのPluginで作ったファイルも例外ではありません。   GitHub Pages with an unsupported plugin   サポートされないpluginでもローカルでbuildした後、ファイルを上げればサービスが可能になります。   このためには先ずはどのbranchがGitHub Pagesに設定されているか確認する必要があります。   repositoryのsettingsにGitHub Pagesという項目があります。           筆者の場合はmaster branchを使用中ということを確認できました。   ですので、master branchにjekyllでbuildしたファイルを上げておけば、GitHub Pagesをサービスすることができるようになります。   ソースとファイルを分けて、管理   master branchにbuildしたファイルを上げたら、ソースは分けて上げたくなりました。   それでsourcesというbranchを作り、ソースは該当のbranchにpushするとことにしました。   しかし、buildされたファイルはmaster branchにpushしなければならないので、都度branchを変更してpushする面倒なことになりました。   これを全て手作業でしたら、ミスも出るし、面倒なので、下のようなPowerShell Scriptを作って自動化しました。   PowerShell Script  chcp 65001 $env:JEKYLL_ENV = 'production' rm -r _site/* git clone -b master https://github.com/DuiNaru/duinaru.github.io.git _site bundle exec jekyll build cd _site git add -A git commit -am 'jekyll build' git push   build時、エラーを解決するためのchcp 65001とjekyllをproduction環境でbuildするための$env:JEKYLL_ENV = 'production'が含まれています。   jekyllをproduction環境でbuildをして上げる理由については次に説明します。   これで、GitHub Pagesがサポートしないpluginでもサービスが可能になりました。  ","categories": ["programming"],
        "tags": ["jekyll","ruby"],
        
        "url": "https://duinaru.github.io/ja/2019/10/26/how-to-make-a-github-pages-work-with-an-unsupported-plugin",
        
        "teaser":null},{
        "title": "ブログにコメント機能を追加しました",
        "excerpt":"使用しているMinimal Mistakes テーマは多様なコメントサービスを使えるように設定できて、使いました。   コメントを追加するページにcomment: trueを追加し、_config.xmlには使用するサービスの情報を入力すればできます。   筆者はdisqusというコメントサービスを使ってみました。   disqusに会員登録してサイトを生成し、ShortNameを分かればできます。   shortnameはサイトを生成する時や、生成した後に設定ページでも分かります。      site生成          site設定       後は_config.xmlに設定すればできます。   会員登録と使用設定すれば終わるので、簡単ですね。   確認してみましょう。      出ない。     理由を探してみましょう。   おかしいです。どう見ても今までの設定でできそうです。   それで、Minimal Mistakesでdisqusと関係したcommentのソースコードを探してみました。      _includes\\comments.html      disqusのためにsectionを作っていることが確認できます。   それで、該当のhtmlをincludeしているファイルを探してみました。      _layouts\\single.html      singleのレイアウトページの一部です。   何かの条件でincludeをしていることが確認できます。   site.comments.providerは_config.xmlで設定し、page.commentsはtrueに設定しておきました。      jekyll.environment == ‘production’は？     あ、Minimal Mistakes  comment設定のNoteがこの内容のようですね！   jekyllをproduction環境でbuildする   jekyll build オプションでEnvironmentを設定できます。   コードからはjekyll.environmentで読み取れ、buildの設定に分けて異なる結果物を作ることができるようになります。   Minimal Mistakesはproductionでbuildした場合のみ、commentを使用できるようにしてありますので、buildの時にEnvironmentをproductionに設定しなければなりません。   GitHub Pagesでbuildする場合なら、自動的にproductionに設定されてbuildされますが、筆者はlocalでbuildをしているので設定する必要がありました。   linuxの環境でしたら、Environmentで説明しているようにすればいいですが、windowsなら別です。   cmdの場合  set JEKYLL_ENV=production   powershellの場合  $env:JEKYLL_ENV = 'production'   上記のコマンドを実行した後にbuildやserveをしたら、productionで作られます。   これで、Minimal Mistakesにコメント機能を追加することができました。  ","categories": ["programming"],
        "tags": ["jekyll","ruby"],
        
        "url": "https://duinaru.github.io/ja/2019/11/03/experience-using-comments-with-minimal-mistakes",
        
        "teaser":null},{
        "title": "ruby on railsをec2に実装してみました。",
        "excerpt":"rubyを知りましたので、rubyでウェブサイトを開発したくてruby on railsを始めました。   開発しながらruby on railsを学習する目的で、環境構築から始めました。   EC2 生成   AMI   ubuntu(Ubuntu Server 18.04 LTS (HVM), SSD Volume Type)を選びました。   他の設定はfree-tierができるようにしました。   Security groups   SSHができるように22ポートは可能にし、他はその時に解放します。   インストール   SSHで接続し、インストールします。   Ruby on Rails の Getting Started with Rails を元に進めました。   パッケージアップデート   sudo apt-get update   Ruby インストール   sudo apt-get install ruby-full   Ruby バージョン確認  ruby -v  railsで要求されるruby 2.5.0の以降のバージョンか確認します。          2.5.xですね。   sqlite3 インストール  sudo apt-get install sqlite3   sqlite3 バージョン確認  sqlite3 --version   rails インストール  sudo gem install rails   インストールのエラー       Could not create Makefile due to some reason, probably lack of necessary libraries and/or headers.    インストールの途中でエラーが発生しました。Nokogiriで一部のライブラリがなくて出るエラーのようですね。   Nokogiri Homepageで解決策を探してみましょう。   install-with-system-librariesのようにしたらできました。  sudo apt-get install pkg-config  rails のインストールを続きます。   rails バージョン確認  rails --version          やっとインストール完了です。   次はCreating the Blog Applicationでメイン画面まで進んでみます。  ","categories": ["programming"],
        "tags": ["ruby","rails","aws","ec2"],
        
        "url": "https://duinaru.github.io/ja/2019/11/14/set-up-ruby-on-rails-ec2",
        
        "teaser":null},{
        "title": "Rails画面確認とCloud9設定",
        "excerpt":"サンプル画面を確認し、本格的な開発にあたってIDEをCloud9で使用する設定をしました。   blog 生成   blogという名前のrailsアプリケーションを作りました。  rails new blog  該当のコマンドで予め用意されているblogアプリケーションがダウンロードされます。   エラー発生   ダウンロードは完了しましたが、エラーが出ました。   Gem::Ext::BuildError: ERROR: Failed to build gem native extension. current directory: /tmp/bundler20191116-12860-iie6sqlite3-1.4.1/gems/sqlite3-1.4.1/ext/sqlite3 /usr/bin/ruby2.5 -r ./siteconf20191116-12860-3nvvhf.rb extconf.rb checking for sqlite3.h... no sqlite3.h is missing. Try 'brew install sqlite3', 'yum install sqlite-devel' or 'apt-get install libsqlite3-dev' and check your shared library search path (the location where your sqlite3 shared library is located). *** extconf.rb failed *** Could not create Makefile due to some reason, probably lack of necessary libraries and/or headers.  Check the mkmf.log file for more details.  You may need configuration options.   sqlite3 1.4.1がちゃんとインストール出来ていないようです。   gem install sqlite3 -v '1.4.1'でも同じでしたので、次のコマンドで解決できました。   sudo apt-get install libsqlite3-dev sudo gem update bundle install   railsを実行してみましょう。   rails server   また、エラー   エラーが出ました。   /var/lib/gems/2.5.0/gems/webpacker-4.2.0/lib/webpacker/configuration.rb:95:in `rescue in load': Webpacker configuration file not found /home/ubuntu/blog/config/webpacker.yml. Please run rails webpacker:install Error: No such file or directory @ rb_sysopen - /home/ubuntu/blog/config/webpacker.yml (RuntimeError)   webpackerのインストールが必要そうですね。   先ずはnode.jsとyarnをインストールし、webpackerをインストールしました。   curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - sudo apt-get install -y nodejs curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - echo \"deb https://dl.yarnpkg.com/debian/ stable main\" | sudo tee /etc/apt/sources.list.d/yarn.list sudo apt-get update &amp;&amp; sudo apt-get install yarn rails webpacker:install   インストール完了後、railsサーバを立ち上げることができました。          接続してみましょう。   ローカル環境でしたら、127.0.0.1:3000で接続できますが、今はec2で、設定を変えました。   80ポートを使用可能にSecurity Groupの設定を変更   EC2のSecurity GroupのInboundに80ポートを追加しました。   0.0.0.0:80でサーバ起動   rails server -b 0.0.0.0 -p 80   接続   EC2のパブリックipに接続してみました。      サーバ起動中      メイン画面     やっとメイン画面が出ました。これからは本格的な開発になりそうですね。   Cloud9設定   その前に、IDEを使用するために設定しました。   SSHでアクセスすればどんなIDEも使用可能ですが、AWSのEC2で環境を構築しまして、IDEもAWSの物を使ってみます。   Cloud9は最初からすぐにEC2で環境構築が可能ですが、今回は作ったEC2を使用します。   Creating an SSH Environment   接続するipが変わらないようにelastic ipを割り当て、上のリンクにある~/.ssh/authorized_keysを作成しました。   後は、AWS Cloud9 Installerが実行されました。          インストールが終わった後、Cloud9の画面の下のbashにrails server -b 0.0.0.0 -p 80を実行し、サーバが立ち上がってメイン画面も確認できました。   これからは本格的な開発になりそうです。  ","categories": ["programming"],
        "tags": ["ruby","rails","aws","cloud9"],
        
        "url": "https://duinaru.github.io/ja/2019/11/16/develop-using-cloud9",
        
        "teaser":null}]

var store = [{
        "title": "開発と経験があるブログ",
        "excerpt":"普段考えていた色々なものを書こうとブログを作ることにしました。 ブログを運営するならブログサービスを利用した方が簡単で便利だろうと思っていた時にgithub.ioというドメインを見つけました。 結果としては、github pagesで実装しました。 必要な物 github github pagesをサービスするrepositoryを作りました。 jekyll github pagesはjekyllをサポートします。 jekyllで作ったソースをrepositoryに置いておくだけでビルド-デプロイをしてくれます。 ruby jekyllで作るにはrubyが必要です。 buildをしたり、pluginをインストールして機能を追加することができます。 作る ruby jekyllのbuildと様々なpluginを利用するためにインストールしました。 jekyllの公式ホームページに手順があり、便利でした。 マルチランゲージ 少なくとも2ヶ国語で運営することを目指してしていまして、マルチランゲージのサポートのためpolygot pluginを使用しました。 このプラグインはgithub pagesで公式的にサポートするプラグインではありませんので、単純にrepositoryにソースを置いておくことだけでビルドはできません。 でも、対策はあるでしょう。 テーマ テーマを選ぶことに時間がかなりかかりました。 これにしようかあれにしようかとしたら時間があっという間に過ぎました。 結局はMinimal Mistakesにすることにしました。 しかし、ここで問題が発生しました。 buildの時、エラーが出ます。 polyglot pluginが動かないです。 問題解決 windows環境でbuildの時、文字関連エラーの解決 rubyをwindowsの環境で使おうとしたら出るエラーでした。 vscodeからcmdでビルドしていたので、chcp 65001 でUTF-8に変えて解決しました。 他には、jekyllをエラーが出ないバージョンに変更する方法もありますが、下記の問題でバージョンを制限するしかありませんでした。 Minimal Mistakesとpolygot pluginを共に使用 ウェブページを正常に作れない問題が出ました。 これについては色々トライし、次のように解決できました。 jekyllバージョン制限 jekyllのバージョンを3.8.5としたら、polygot pluginと共に動きました。 polyglot...","categories": [],
        "tags": [],
        "url": "https://duinaru.github.io/2019/10/23/blog-with-development-and-experience",
        "teaser":null}]

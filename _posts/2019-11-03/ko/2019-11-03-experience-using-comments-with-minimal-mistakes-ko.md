---
title: Blog에 댓글 기능을 추가하였습니다
layout: single
author_profile: true
comments: true
share: true
related: true
lang: ko
permalink: "/:categories/:year/:month/:day/experience-using-comments-with-minimal-mistakes"
---

사용하고 있는 Minimal Mistakes 테마는 여러 댓글 서비스를 사용할 수 있게 [설정](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#comments) 할 수 있습니다.

댓글을 사용할 페이지에 `comment: true`를 추가하고, `_config.xml`에 사용할 서비스와 정보를 입력하기만 하면 됩니다.

이번에는 disqus라는 댓글 서비스를 사용해 보았습니다.

[disqus](https://disqus.com/)에 가입한 뒤에 사이트를 [생성](http://disqus.com/admin/create)해주고, [ShortName](https://help.disqus.com/en/articles/1717111-what-s-a-shortname)을 알면 됩니다. 

shortname은 사이트를 생성할 때, 또는 생성하고 설정 화면에서도 알 수 있습니다.

>[site생성](http://disqus.com/admin/create)
>  ![shortname](\assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\create-site.png)
> 

>[site설정](https://disqus.com/admin/settings/general/)
>  ![shortname](/assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\shortname.png)
> 

그런다음에, `_config.xml` 에 [설정](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#disqus)하면 됩니다.

가입하고 테마에 사용 설정만 하면 되니 간단하네요.

이제 확인 해봅시다.

> 안 보이네요.
> 

**이유를 찾아봅시다.**

이상합니다. 아무리 봐도 위의 설정으로 될 것 같은데요.

그래서, Minimal Mistakes 테마에서 disqus와 관련된 comment소스를 찾아 봤습니다.

> \_includes\comments.html
> ![comments.html](/assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\comments.png)
> 

disqus를 위해 section을 만들고 있습니다.

그래서 이번엔 해당 html을 include하는 파일을 찾아봤습니다.

> \_layouts\single.html
> ![single](\assets\images\2019-11-03-experience-using-comments-with-minimal-mistakes\single.png)
> 

single 레이아웃 페이지의 일부입니다.

무언가의 조건으로 include를 하고 있는게 보입니다.

`site.comments.provider` 은 `_config.xml` 에서 설정했고, `page.comments` 는 `true` 로 설정해 두었죠.

> jekyll.environment == 'production' 는 뭐죠?
> 

아, Minimal Mistakes  [comment설정](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#comments) 의 Note가 이 내용인듯 하군요!

# jekyll을 production환경으로 build하기

[jekyll build 옵션](https://jekyllrb.com/docs/configuration/options/#build-command-options)에서 [Environment](https://jekyllrb.com/docs/configuration/environments/)를 설정할 수 있습니다.

이 값는 `jekyll.environment`로 알아낼 수 있으며,  build 설정에 따라 다른 결과물을 출력 할 수 있게 해줍니다.

Minimal Mistakes 는 production으로 build된 경우에만 comment를 사용하도록 하였기 때문에, build시 Environment를 production으로 설정해야합니다.

GitHub Pages에서 build를 하는 경우라면 자동적으로 production으로 설정되어 build가 되나, 필자는 local에서 build를 하고 있기에 따로 설정을 해주었습니다.

linux환경이였다면 [Environment](https://jekyllrb.com/docs/configuration/environments/)페이지 처럼 하면 되지만, windows라면 다릅니다.

*cmd인 경우*
```
set JEKYLL_ENV=production
```

*powershell인 경우*
```
$env:JEKYLL_ENV = 'production'
```

해당 명령어 뒤에 build나 serve를 하면 production으로 만들어집니다.

이로써, Minimal Mistakes 에 댓글 기능을 추가할 수 있었습니다.
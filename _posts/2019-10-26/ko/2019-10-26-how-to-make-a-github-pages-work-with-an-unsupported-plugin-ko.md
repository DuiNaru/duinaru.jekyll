---
title: GitHub Pages에서 지원하지 않는 플러그인 쓰기
layout: single
author_profile: true
comments: true
related: true
category: programming
tags: [jekyll, ruby]
lang: ko
permalink: "/:year/:month/:day/how-to-make-a-github-pages-work-with-an-unsupported-plugin"
---

jekyll을 공식적으로 지원하는 GitHub Pages이지만, 모든 jekyll의 플러그인까지 지원하는 것은 아닙니다.

GitHub Pages는  [지원하는 플러그인](http://pages.github.com/versions/)이 제한 되어있습니다.

이 이외의 플러그인은 GitHub Pages에서 jekyll을 build할때, 제한되어 적용되지 않습니다.

그럼, GitHub Pages에서 jekyll로 웹 페이지 서비스를 만들 때는 일부 플러그인만 사용해야 하는 것 일까요?

반은 맞고 반은 틀립니다.

알아보기 전에, 먼저 어떻게 GitHub Pages가  jekyll를 쓰는지 살펴봅시다.

**GitHub Pages with jekyll source**

GitHub Pages에서 jekyll을 쓰는 간단한 방법입니다.

[공식 도움말](https://help.github.com/en/github/working-with-github-pages/setting-up-a-github-pages-site-with-jekyll)에서도 설명하는 방법처럼 jekyll 소스를 repository에 올려두고 GitHub Pages가 jekyll을 build를 하는 방법입니다.

GitHub Pages에서 문제 없이 사용가능한 플러그인으로 제한을 하니, plugin의 호환성 같은 문제들에 대해 신경 덜 쓰고 만들 수 있다는 장점이 있습니다.

**GitHub Pages without jekyll source**

GitHub Pages는 기본적으로 정적 웹 페이지 호스팅 서비스이므로, jekyll소스가 아닌 웹 파일만 있어도 서비스가 가능합니다.

즉, 무엇으로 만들었던, 서비스에 필요한 파일만 있으면 문제 없다는 것입니다.

이러한 파일들은 jekyll로 build를 할 때, 하위 디렉토리인 \_site에 생기니, 이 파일을 직접 GitHub Pages의 repository에 올려서 사용해도 문제 없이 서비스 할 수 있습니다.

*GitHub Pages에서 지원하지 않는 jekyll의 Plugin으로 만든 파일이라도 말이죠.*

# GitHub Pages with an unsupported plugin

지원하지 않는 plugin이라도 로컬에서 build를 한 뒤에 웹 파일만 올리면, 서비스가 가능하게 됩니다.

이를 위해서 우선 어떤 branch가 GitHub Pages로 설정 되어 있는지 확인 해 볼 필요가 있습니다.

repository의 settings에서 GitHub Pages라는 항목을 찾아 볼 수 있습니다.

> ![GitHub Pages Settings](\assets\images\2019-10-26-how-to-make-a-github-pages-work-with-an-unsupported-plugin\settings-github-pages.png)
> 

저는 master branch를 사용중이라고 확인 할 수 있었습니다.

그러므로, master branch에 jekyll로 build한 파일들을 올려두면, GitHub Pages를 서비스 할 수 있게 됩니다.

**소스랑 파일을 분리해서 관리**

master branch에 build된 파일을 올리니, 소스는 분리하고 싶어졌습니다.

그래서 sources라는 branch를 만들고 소스는 해당 branch에만 push를 하고 있습니다.

하지만, build된 파일은 master branch에 push해야 하니, 매번 branch를 변경해서 push를 해야하는 번거로움이 생겼습니다.

이를 모두 수작업으로 하려면 실수도 하기 마련이고, 번거로우니 아래와 같은 *PowerShell Script*를 만들어서 자동화하였습니다.

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

[build시 문자 오류](/2019/10/23/blog-with-development-and-experience#%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0)를 해결하기 위한 `chcp 65001` 과 jekyll을 production환경으로 build하기 위한 `$env:JEKYLL_ENV = 'production'`이 포함되어있습니다.

jekyll을 production환경으로 build를 해서 올리는 이유에 대해서는 다음에 설명하도록 하겠습니다.

이걸로 지원하지 않는 플러그인이라도 GitHub Pages에 서비스 할 수 있게 되었습니다.
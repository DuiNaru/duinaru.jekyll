---
title: 개발과 경험이 함께 하는 블로그
layout: single
author_profile: true
comments: true
related: true
lang: ko
permalink: "/:categories/:year/:month/:day/blog-with-development-and-experience"
---

평소에 생각하던 이것저것을 적어볼까 하다가 블로그를 만들게 되었습니다.

블로그를 운영한다면 블로그 서비스를 이용하는 편이 간단하고 편할 듯 했지만, github.io 라는 도메인이 눈에 들어오더군요.

그래서 github pages로 만들게 되었습니다.

# 준비물

**github**

github pages를 서비스할 repository를 만들었습니다.

**jekyll**

github pages는 jekyll을 지원합니다.

jekyll로 만든 소스를 repository에 올려 두는 것 만으로도 빌드-배포를 해주죠.

**ruby**

jekyll로 만들려면 ruby가 필요합니다.

build를 하거나, plugin을 설치해서 기능을 추가해볼 수 있습니다.

# 만들기

**ruby**

jekyll의 build와 여러 plugin을 설치하기 위해 설치해주었습니다.

jekyll 공식 홈페이지에 사용 방법이 친절히 적혀있어서 별 어려움이 없었습니다.

**다국어 지원**

적어도 2개국어로 운영할 생각이니, 다국어 지원을 위해 [polygot plugin](https://polyglot.untra.io/)을 설치해 주었습니다.

이 플러그인이 github pages에서 공식적으로 지원하는 플러그인이 아니기에, 단순히 repository에 소스를 올려두는 것으로 빌드가 되지 않습니다.

하지만, 다 방법이 있죠.

**테마 선택하기**

이 과정에서 시간이 상당히 걸렸습니다.

이걸로 해볼까 저걸로 해볼까 하면서 고르다가 시간이 순식간에 지나가네요.

결국에는 [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)로 하기로 했습니다.

하지만, 여기서 문제가 발생하였습니다.

> build할 때, 에러가 발생해요.
> 
> polyglot plugin이 작동하질 않아요.
> 

# 문제 해결

**windows환경에서 build할 때, 문자 관련 에러 해결**

ruby를 windows환경에서 쓰려다 보니 발생하는 에러 였습니다.

> ![빌드 에러](\assets\images\2019-10-23-blog-with-development-and-experience\build-error.png)
> 

vscode에서 cmd로 빌드 하고 있었기에, `chcp 65001` 을 이용해서 UTF-8로 바꿔서 해결했습니다.

다르게는 jekyll을 에러가 발생하지 않는 버전으로 바꾸는 방법도 있으나, 아래의 문제로 인해 버전을 제한 할 수 밖에 없었습니다.

**Minimal Mistakes과 polygot plugin을 함께 사용하기**

웹 페이지가 제대로 만들어 지지 않는 문제가 발생하였습니다.

시행착오 끝에, 다음과 같이 해결이 되었습니다.

*jekyll버전*

jekyll를 3.8.5으로 사용하니, polygot plugin과 함께 작동합니다.

*polyglot plugin의 _config.xml설정*

> ![polyglot setting](\assets\images\2019-10-23-blog-with-development-and-experience\polyglot-setting.png)
> 

languages의 언어 설정 순서를 default_lang에서 설정한 언어를 먼저 오게 설정하니 polygot plugin이 잘 작동합니다.

# 기능 추가

**언어 선택**

다국어 지원을 위해 언어를 바꾸는 기능을 추가해 주었습니다.

페이지 하단에 보이는 KO나 JA같은 것이죠.

**댓글**

Minimal Mistakes에서도 지원하는 [disqus](https://disqus.com/)를 이용해서 추가했습니다.

# 후기

만들다 보니 시간이 꽤나 흘렀습니다.

앞으로는 글도 쓰면서, 이것저것 업데이트 해 볼까 합니다.
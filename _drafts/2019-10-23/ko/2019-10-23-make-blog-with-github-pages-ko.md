---
title: Github Pages로 블로그 만들기
layout: single
author_profile: true
read_time: true
comments: true
related: true
permalink: "/:categories/:year/:month/:day/make-blog-with-github-pages"
lang: ko
---

자신의 홈페이지를 가지고 싶다는 생각을 해본 적이 있는 분들이 있을 것입니다.

블로그 서비스를 이용하여 블로그를 운영해 볼 수 도 있고, 웹 호스팅이나 직접 구축한 서버를 이용하여 웹 서비스를 만들어서 운영해 볼 수도 있을 것입니다.

필자도 이러한 생각을 하던 중에 Github Pages라는 것을 알게 되어서 만들어 보게 되었습니다.

# Github Pages

Github Pages라는 단어를 처음 들었을때는 반만 익숙한 느낌이였습니다.

*Github는 들어봤는데, Pages는 뭐지?*

[Github Pages](https://pages.github.com/)는 Github에서 제공하는 웹 페이지 서비스입니다.

Git repogitory를 웹 페이지 서비스로 이용한다고 합니다.

*git repogitory를 웹 서비스로?*

Github Pages는 repogitory에 저장되어 있는 html파일을 url에 연결시켜주어, 브라우저에서 누구나 접속 가능하도록 해줍니다.

URL은 주로 다음과 같이 생겼습니다.
> https://[username].github.io/
> 

Github Pages로 설정된 repogitory의 index.html 파일을 해당 URL로 바로 볼 수 있게 됩니다.

즉, repogitory에 html를 만들어 두는 것만으로도 누구나 웹 페이지를 볼 수 있게 됩니다.

# index.html 만들어보기

URL을 입력했을때 바로 보이는 웹 페이지를 한번 만들어서 잘 작동하는지 확인해 봅시다.

**Github Page용 repogitory 생성**

가장 먼저 웹 페이지로 만들 repogitory가 필요합니다.

[Github](https://github.com/)에 로그인하여 repogitory를 만들어줍니다.

> ![repogitory 만들기](/assets/images/2019-10-23-make-blog-with-github-pages/create-repogitory.png)
> 

username에는 자신의 Github ID 를 넣고, Create repogitory를 클릭하면 완성됩니다.

**index.html 을 repogitory 에 추가하기**

이미 git에 익숙한 분들이라면, 익숙한 방법으로 repogitory에 index.html이라는 파일명으로 html을 하나 만들어서 넣어주면 됩니다.

이번에는 간단하게 github.com에서 만들어 봅시다.

방금 만든 repogitory에서 create new file 버튼을 누르면 됩니다.

> [Creating new files](https://help.github.com/en/github/managing-files-in-a-repository/creating-new-files)
> 

Github가 익숙하지 않은 분들이라면 상단의 [Creating new files](https://help.github.com/en/github/managing-files-in-a-repository/creating-new-files)를 따라하면 문제없이 만들 수 있습니다.

파일 이름은 index.html, 파일 내용은 다음과 같이 입력해봅시다.

```
<!DOCTYPE html>
<html>
<body>
<h1>Hello World</h1>
<p>I'm hosted with GitHub Pages.</p>
</body>
</html>
```

파일을 만들 고 난 뒤에 repogitory에 index.html이 있는 것을 확인 한 후, 브라우저의 URL에 repogitory이름을 넣어봅시다.

> ![index.html](\assets\images\2019-10-23-make-blog-with-github-pages\index.png)

위와 같은 화면을 확인 할 수 있습니다.

그럼 이제 index.html을 직접 수정하여 웹 서비스를 운영해야하는 건가 의문이 들 것입니다.

다음에는 이를 간단히 해주는 방법을 알아보도록 하겠습니다.
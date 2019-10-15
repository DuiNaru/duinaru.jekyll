chcp 65001
rm -r _site/*
git clone -b master `github.com/DuiNaru/duinaru.github.io.git` _site
bundle exec jekyll build
cd _site
git add -A
git commit -am 'jekyll build'
git push
chcp 65001
# set JEKYLL_ENV=production
$env:JEKYLL_ENV = 'production'
rm -r _site/*
git clone -b master https://github.com/DuiNaru/duinaru.github.io.git _site
bundle exec jekyll build
cd _site
git add -A
git commit -am 'jekyll build'
git push
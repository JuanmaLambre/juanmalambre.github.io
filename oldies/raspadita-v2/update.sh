DEST=$(dirname $(pwd)'/'$0)

cd ~/workplace/raspadita-ypf-v2
npm run build

cp -r dist/bundle.js dist/index.html dist/main.css $DEST

cd $DEST
git add . -A
git commit -am "Update raspadita-v2"
git push


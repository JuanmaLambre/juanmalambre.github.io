DEST=$(dirname $(pwd)'/'$0)

cd ~/workplace/raspadita-ypf
npm run build

cp -r dist/index.html dist/app.bundle.js dist/app.css dist/assets $DEST

cd $DEST
git add . -A
git commit -am "Update raspadita"
git push


DEST=$(echo $(pwd)'/'$0)

cd ~/workplace/raspadita-ypf
npm run build

cp dist/index.html dist/app.bundle.js dist/app.css $DEST

cd $DEST
git add . -A
git commit -am "Update raspadita"
git push


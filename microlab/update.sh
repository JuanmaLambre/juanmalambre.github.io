REPODIR=/Users/juanme/workplace/juanmalambre.github.io
ORIGIN=/Users/juanme/workplace/CITEP/labVRMicroUBA
DESTINATION=$REPODIR/microlab

cd $ORIGIN
npm run build

cp $ORIGIN/dist/app.bundle.js $ORIGIN/dist/app.css $ORIGIN/dist/index.html $DESTINATION
cp $ORIGIN/public/fonts/* $REPODIR/public/
cp $ORIGIN/dist/*.mp3 $REPODIR/public/
cp -r $ORIGIN/public/** $DESTINATION/../public/

cd $DESTINATION
git add ./**
git commit -am Update
git push

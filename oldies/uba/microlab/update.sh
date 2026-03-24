ORIGIN=/Users/juanme/workplace/CITEP/labVRMicroUBA
DESTINATION=/Users/juanme/workplace/juanmalambre.github.io/microlab

cd $ORIGIN
npm run build

cp $ORIGIN/dist/app.bundle.js $ORIGIN/dist/app.css $ORIGIN/dist/index.html $DESTINATION
cp $ORIGIN/dist/*.mp3 $DESTINATION
cp -r $ORIGIN/public/** $DESTINATION/public/

cd $DESTINATION
git add ./**
git commit -am Update
git push

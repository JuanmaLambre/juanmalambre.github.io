ORIGIN=/Users/juanme/workplace/CITEP/topografiaVRUBA
DESTINATION=/Users/juanme/workplace/juanmalambre.github.io/topografia

cd $ORIGIN
npm run build

cd $DESTINATION
cp $ORIGIN/dist/app.bundle.js $ORIGIN/dist/app.css .
cp -R $ORIGIN/public/** .

git add ./**
git commit -am Update
#git push

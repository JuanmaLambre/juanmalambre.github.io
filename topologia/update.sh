ORIGIN=/Users/juanme/workplace/CITEP/topologiaVRUBA
DESTINATION=/Users/juanme/workplace/juanmalambre.github.io/topologia

cd $ORIGIN
npm run build

cp $ORIGIN/dist/app.bundle.js $ORIGIN/dist/app.css $ORIGIN/dist/index.html $DESTINATION
cp $ORIGIN/public/maps/* $DESTINATION/maps
cp $ORIGIN/public/models/* $DESTINATION/models

cd $DESTINATION
git add ./**
git commit -am Update
git push

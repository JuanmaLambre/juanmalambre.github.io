ORIGIN=/Users/juanme/workplace/CITEP/labVRMicroUBA
DESTINATION=/Users/juanme/workplace/juanmalambre.github.io/microlab

cd $ORIGIN
npm run build

cp $ORIGIN/dist/app.bundle.js $ORIGIN/dist/app.css $ORIGIN/dist/index.html $DESTINATION
cp $ORIGIN/public/maps/* $DESTINATION/public/maps
cp $ORIGIN/public/models/* $DESTINATION/public/models


ORIGIN=/Users/juanme/workplace/CITEP/topologiaVRUBA
DESTINATION=/Users/juanme/workplace/juanmalambre.github.io/topologia

cd $ORIGIN
npm run build

cp -r $ORIGIN/public .

cd $DESTINATION
git add ./**
git commit -am Update
git push

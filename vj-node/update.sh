ORIGIN=/Users/juanme/workplace/vjing/vj-node
DESTINATION=/Users/juanme/workplace/juanmalambre.github.io/vj-node

cd $ORIGIN
npm run build

cd $DESTINATION
cp -r $ORIGIN/dist/** .

git add ./**
git commit -am Update
git push

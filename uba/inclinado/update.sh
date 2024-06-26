#!/bin/bash

ORIGIN_DIR="/Users/juanme/workplace/UBATIC/vite-blender"
DESTINATION_DIR="/Users/juanme/workplace/juanmalambre.github.io/uba/inclinado"

rm -rf assets

cd $ORIGIN_DIR
npm run build
cp -r dist/** $DESTINATION_DIR

cd $DESTINATION_DIR
sed -i -e 's:/assets/:/uba/inclinado/assets/:g' index.html

git add . -A
git commit -am "Update cupula"
git push

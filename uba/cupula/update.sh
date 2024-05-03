#!/bin/bash

ORIGIN_DIR="/Users/juanme/workplace/UBATIC/astro-cupula"
DESTINATION_DIR="/Users/juanme/workplace/juanmalambre.github.io/uba/cupula"

cd $ORIGIN_DIR
npm run build
cp -r dist/** $DESTINATION_DIR

cd $DESTINATION_DIR
mv _astro astro
sed -i -e 's/_astro/astro/g' index.html

git add . -A
git commit -am "Update cupula"
git push

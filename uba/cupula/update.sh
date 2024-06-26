#!/bin/bash

ORIGIN_DIR="/Users/juanme/workplace/UBATIC/astro-cupula"
DESTINATION_DIR="/Users/juanme/workplace/juanmalambre.github.io/uba/cupula"

rm -rf $DESTINATION_DIR/astro

cd $ORIGIN_DIR
npm run build
cp -r dist/** $DESTINATION_DIR

cd $DESTINATION_DIR
mv _astro astro
sed -i -e 's:_astro:uba/cupula/astro:g' index.html
sed -i -e "s|<style>.*</style>|<style>$(cat $(ls astro/index.*.css))</style>|g" index.html 

git add . -A
git commit -am "Update cupula"
git push

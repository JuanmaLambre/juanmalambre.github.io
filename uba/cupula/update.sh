#!/bin/bash

ORIGIN_DIR="/Users/juanme/workplace/UBATIC/astro-cupula"
DESTINATION_DIR="/Users/juanme/workplace/juanmalambre.github.io/uba/cupula"

cd $ORIGIN_DIR
npm run build
cp -r dist/** $DESTINATION_DIR
cp -r public $DESTINATION_DIR

cd $DESTINATION_DIR
git add . -A
git commit -am "Update resorte"
git push

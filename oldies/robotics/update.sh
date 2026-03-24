#!/bin/bash

ORIGIN_DIR="/Users/juanme/workplace/playground/robotics"
DESTINATION_DIR="/Users/juanme/workplace/juanmalambre.github.io/robotics"

cd $ORIGIN_DIR
npm run build
cp -r dist/** $DESTINATION_DIR
cp -r assets $DESTINATION_DIR

cd $DESTINATION_DIR
git add . -A
git commit -am "Update resorte"
git push

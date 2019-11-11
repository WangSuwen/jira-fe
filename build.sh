echo "<<<<<<< npm install >>>>>>>"
npm install
if [ ! -d "zips" ] ; then
  mkdir zips
else
  echo "文件夹已经存在"
fi
if [ "${ENV}" !=  "prod" ] ; then
  echo "<<<<<<   building  staging   >>>>>>"
  node_modules/.bin/webpack --config ./build/webpack.dev.config.js
  cd dist
  echo "<<<<<< compress static resource  >>>>>>"
  zip -r ../zips/0.1.0_${BUILD_NUMBER}.zip *
  cd ..
else
  echo "<<<<<< webpack building production >>>>>>"
  node_modules/.bin/webpack --config ./build/webpack.prod.config.js
  cd dist
  echo "<<<<<< compress static resource  >>>>>>"
  zip -r ../zips/0.1.0_${BUILD_NUMBER}.zip *
  cd ..
fi
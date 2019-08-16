APP_NAME=$1
npx create-fitbit-app $APP_NAME
cd $APP_NAME/app
echo -e "import clock from \"clock\"\nimport document from \"document\"" > index.js

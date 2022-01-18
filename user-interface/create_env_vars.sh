touch ./.env
echo "$PWD"

for EVAR in "$@"
do
   echo "$EVAR"
   echo "$EVAR" >> .env
done
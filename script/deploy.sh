echo "---- Running deployment script on remote server ----"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd $1
npm install
pm2 restart $2
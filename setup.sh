#!/bin/bash
cd prosperiti/client
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
hash -r
npm install
cd ../server
./install.sh
cd ..
nohup fastapi run server/main.py > server.log 2>&1 &
cd client
nohup npm run dev > client.log 2>&1 &
wait

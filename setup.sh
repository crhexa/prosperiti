#!/bin/
set -e
sudo dnf install -y nodejs
sudo dnf install -y python3.12
cd client
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
hash -r
npm install
sudo sed -i "0,/key=/s//key=${GMAP_API_TOKEN}/" index.html

cd ../server
sudo chmod +x install.sh
./install.sh
source prosperiti/bin/activate
cd ..
nohup fastapi run server/main.py > server.log 2>&1 &
cd client
nohup npm run dev > ../client.log 2>&1 &
wait

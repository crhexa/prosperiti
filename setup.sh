#!/bin/bash
set -e
PID_LOG="./pidlog"

if [[ "$1" != "--restart"]]; then
    sudo dnf install -y nodejs
    sudo dnf install -y python3.12
    cd client
    sudo npm cache clean -f
    sudo npm install -g n
    sudo n stable
    hash -r
    npm install
fi

cd /home/ec2-user/prosperiti/server
sudo chmod +x install.sh
./install.sh
source prosperiti/bin/activate
cd ..

if [ ! -f "$PID_LOG" ]; then
    touch "$PID_LOG"
    chmod 644 "$PID_LOG"
fi
nohup dotenv run -- fastapi run server/main.py > server.log 2>&1 & disown
PID=$!
cat <<EOF >> "$PID_LOG"
server $PID
EOF

sudo dotenv run -- sed -i "0,/key=/s//key=${GMAP_API_TOKEN}/" client/index.html
cd client
nohup npm run dev > ../client.log 2>&1 & disown
PID=$!
cat <<EOF >> "$PID_LOG"
client $PID
EOF
wait

#!/bin/bash
set -e
PID_LOG="./pidlog"
PDIR="/home/ec2-user/prosperiti/"

if [[ "$1" != "--restart" ]]; then
    sudo dnf install -y nodejs
    sudo dnf install -y python3.12
    cd "$PDIR/client"
    sudo npm cache clean -f
    sudo npm install -g n
    sudo n stable
    hash -r
    npm install
    cd "$PDIR/server"
    sudo chmod +x install.sh
    ./install.sh
fi

cd "$PDIR"
source server/prosperiti/bin/activate

if [ ! -f "$PID_LOG" ]; then
    touch "$PID_LOG"
    chmod 644 "$PID_LOG"
fi
nohup dotenv run -- fastapi run server/main.py > server.log 2>&1 & disown
PID=$!
cat <<EOF >> "$PID_LOG"
server $PID
EOF

dotenv run -- sudo sed -i "0,/key=/s//key=${GMAP_API_TOKEN}/" client/index.html
cd client
nohup npm run dev > ../client.log 2>&1 &
PID=$!
cat <<EOF >> "$PID_LOG"
client $PID
EOF
wait

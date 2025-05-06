#!/bin/bash
set -e
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
    ./install.sh
fi

cd "$PDIR"
source server/prosperiti/bin/activate

if [ ! -f "$PDIR/pidlog" ]; then
    touch "$PDIR/pidlog"
    chmod 644 "$PDIR/pidlog"
fi
nohup dotenv run -- fastapi run server/main.py > server.log 2>&1 &
echo "server $!" >> "$PDIR/$PID_LOG"

dotenv run -- sudo sed -i "0,/key=.*\&/s//key=${GMAP_API_TOKEN}\&/" client/index.html
cd "$PDIR/client"
nohup npm run dev > ../client.log 2>&1 &
echo "client $!" >> "$PDIR/pidlog"
disown

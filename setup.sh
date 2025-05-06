#!/bin/bash
set -e
PDIR="/home/ec2-user/prosperiti"

if [[ "$1" != "--restart" ]]; then
    sudo dnf install -y nftables
    sudo dnf install -y nodejs
    sudo dnf install -y python3.12
    sudo nft add table nat
    sudo nft add chain nat prerouting { type nat hook prerouting priority 0 \; }
    sudo nft add rule nat prerouting tcp dport 80 redirect to 5173
    cd "$PDIR/client"
    sudo npm cache clean -f
    sudo npm install -g n
    sudo n stable
    hash -r
    npm install
    cd "$PDIR/client/server"
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
echo "server $!" >> "$PDIR/pidlog"

export GMAP_API_TOKEN=$(dotenv get GMAP_API_TOKEN)
export GOOGLE_MAPS_API_KEY="$GMAP_API_TOKEN"
sudo sed -i "0,/key=.*\&/s//key=${GMAP_API_TOKEN}\&/" client/index.html

cd "$PDIR/client"
nohup npm run dev > "$PDIR/client.log" 2>&1 &
echo "client $!" >> "$PDIR/pidlog"

cd "$PDIR/client/server"
nohup npm run dev > "$PDIR/chat.log" 2>&1 &
echo "chat   $!" >> "$PDIR/pidlog"
disown

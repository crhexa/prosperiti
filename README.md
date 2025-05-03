# Prosperiti

## Deployment
```
sudo dnf install -y git
cd /home/ec2-user/
git clone https://github.com/crhexa/prosperiti.git
cd prosperiti
sudo chmod +x setup.sh
sudo chmod +x rkeys.sh
./rkey.sh "your_openai_key" "your_google_maps_key" "your_meetup_api_key"
./setup.sh
```
# Prosperiti

## Deployment
```
sudo dnf install -y git
cd /home/ec2-user/
git clone https://github.com/crhexa/prosperiti.git
sudo chown -R ec2-user:ec2-user prosperiti
cd prosperiti
./rkeys.sh "your_openai_key" "your_google_maps_key" "your_meetup_api_key"
./setup.sh
```

## Restart
Assuming the install is successful, first kill any running processes listed in `prosperiti/pidlog`, update the repository and then run `prosperiti/setup.sh --` on the remote machine.
echo "upgrade package and installing Btop(for monitoring), unzip(for bun), bun"
sleep 4
sudo apt upgrade -y
sudo apt install btop unzip -y
sudo apt-get install ca-certificates -y
echo "Installing Bun!"
sleep 10
curl -fsSL https://bun.com/install | bash
sleep 2
echo "Done!"
source /home/user/.bashrc
bun --version



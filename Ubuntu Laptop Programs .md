#### Ubuntu Laptop Programs ####
* Hardware configuration

  * 16GB Ram
* Program Needs to be installed
  * Node js
  * GNU Stow
  * git
  * VS Code
  * BoostNotes
  * Typora
  * snap
  * python 3

* Commanline Utlities
  * explain
  * has
  * nnn
  * buku
  * gcal
  * google-alerts

* Indicators


```bash
# Keylogger

git clone https://github.com/jarun/keysniffer.git
cd keysniffer/
make
sudo insmod kisni.ko

#to know keys:   sudo cat /sys/kernel/debug/kisni/keys
#information   modinfo kisni.ko

#utilities
pip install google-alerts

sudo pip3 install patool
sudo npm install -g gcal
# usage:
# gcal list tomorrow
# gcal insert 'Party tomorrow from 3pm to 5pm'

npm install -g explain-command
 
 sudo apt-get install libncursesw5-dev
 git clone https://github.com/jarun/nnn.git
 cd nnn/
 make
 sudo make install

sudo git clone https://github.com/kdabir/has.git && cd has && make install
# for not standard utlities AS_ALLOW_UNSAFE=y has buku

sudo npm install -g how-2

sudo npm i -g add-gitignore


sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys BA300B7755AFCFAE
sudo add-apt-repository 'deb https://typora.io/linux ./'
sudo apt-get update
sudo apt-get install typora

sudo apt-fast install grc

sudo npm install -g @rafaelrinaldi/whereami

#Indicators

 sudo apt-get install preload
 
 sudo add-apt-repository ppa:apt-fast/stable
 sudo apt-get update
 sudo apt-get install apt-fast
 sudo gedit /etc/apt/apt.conf.d/00aptitude
 
 sudo add-apt-repository ppa:linrunner/tlp
 sudo apt-get update
 sudo apt-get install tlp tlp-rdw
 sudo tlp start
 
 sudo apt-get install indicator-cpufreq
 sudo apt-add-repository ppa:fixnix/netspeed
 sudo apt-get update
 sudo apt-get install indicator-netspeed-unity
 
 sudo apt-get install indicator-multiload
 sudo add-apt-repository ppa:noobslab/indicators
 sudo apt-get update
 sudo apt-get install copyq
 
 sudo add-apt-repository ppa:caffeine-developers/ppa
 sudo apt-get update
 sudo apt-get install caffeine



```


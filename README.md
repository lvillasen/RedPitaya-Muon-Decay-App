# RedPitaya Muon Decay App
This app uses a STEMlab 125-14 RedPitaya board as the only electronic device, in addition to the detector, to perform a muon-decay experiment to measure the time intervals between first pulses due to low-energy muons entering a scintillation or water-Cherenkov detector and a second pulses due to electrons or positrons coming from the decay of the muon inside the detector.</p>

## Requisites

This project assumes the official ecosystem of the Red Pitaya is already installed and in addition it requires the installation of node.js,  express and cors on the Red Pitaya.

I used the following commands to install them:

    wget https://nodejs.org/dist/v17.9.1/node-v17.9.1-linux-armv7l.tar.gz
    tar -xvf node-v17.9.1-linux-armv7l.tar.gz
    cd node-v17.9.1-linux-armv7l 
    cp -R * /usr/local/
    npm install express
    npm install cors
    
 It also requires the Python Periphery module installed on the RedPitaya
 
    pip install python-periphery 
    

Finally, it uses the bitstream file Muon-Decay.bit described in https://github.com/lvillasen/RedPitaya-Muon-Decay


## Usage

Clone the repository
    
Copy the files Muon-Decay.bit, server_3000.js, server_3001.js and start.sh to any folder of the Red Pitaya board
    
On a Red Pitaya terminal cd to that folder and type:


    cat Muon-Decay.bit > /dev/xdevcfg
    chmod a+x start.sh
    ./start.sh

    
Open the file index.html with any browser and type the IP or rp-xxxxxx.local address of your RedPitaya Board
    
Connect ADC1 to DAC1 or alternatively conect the ADC to the detector and follow the instruccions on the web page

Reboot the RedPitaya board or *cat fpga_0.94.bit > /dev/xdevcfg* to reinstall the official bitstream on the Zynq FPGA.


## Credits

This app make extensive use of the Python module called Periphery: https://github.com/vsergeev/python-periphery
    
## License

[MIT](LICENSE)

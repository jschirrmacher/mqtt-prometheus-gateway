# tasmota-prometheus-gateway
A gateway listening on MQTT packets to obtain information from a tasmota sensor to measure an electric power meter and publish it as a prometheus metric

## Prerequisites

To use this, you need a kind of server running NodeJS >= version 16.

## Installation

After cloning the repository and install the dependencies:

    git clone https://github.com/jschirrmacher/tasmota-prometheus-gateway.git
    cd tasmota-prometheus-gateway
    npm install

Next, copy the `.env.template` file to `.env.local` and edit this new file to match your needs.
Then, start the program:

    npm start

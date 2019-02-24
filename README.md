# Crypto-Star-Dapp
Udacity Blockchain Developer project to develop a digital app and deploy to Ethereum network

## Requirements
* Truffle
* OpenZeppelin 
* Node
* [Infura Account](https://infura.io/)
* MetaMask Browser Add-on

Asset|Details
---|---
Truffle Version|5.0.4
OpenZeppelin|2.1.2
ERC-721 Token Name|StarNotary Token
ERC-721 Token Symbol|SUN
Token Address @ Rinkeby|[0x120b6ca46177800c31d7da64c06f3396501bf13f](https://rinkeby.etherscan.io/address/0x120b6ca46177800c31d7da64c06f3396501bf13f)

## Installation
* Download App
    ```
    git clone https://github.com/stevenhankin/Crypto-Star-Dapp.git
    cd Crypto-Star-Dapp
    ```
* Put your Infura Project Secret into ".secret" file
    ```
    echo "MY-PROJECT-SECRET-ID" > .secret
    ```
* Install required packages
    ```
    npm install && cd client && npm install
    ```
* In truffle-config.js, set **infuraKey** to be your Infura Project ID
* From Crypto-Star-Dapp root, deploy StarNotary contract to network
    ```
    truffle compile
    truffle migrate --network rinkeby
    ```
* Start App Server
    ```
    cd client
    npm start
    ```
* Application should now be available on http://localhost:3000

# Testing
Start ```truffle develop``` then run the following:
```
migrate --reset
test
```



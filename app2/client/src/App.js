import React, {Component} from "react";
import ClaimStar from "./ClaimStar";
import LookupStar from "./LookupStar";
import SellStar from "./SellStar";
import BuyStar from "./BuyStar";
// import getWeb3 from "./utils/getWeb3";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Web3 from "web3";

import "./App.css";
import starNotaryArtifact from "./contracts/StarNotary";

class App extends Component {
    state = {web3: null, account: null, contract: null};


    componentDidMount = async () => {
        try {

            console.log('**** COMPONENT MOUNTED!')

            // window.ethereum will be the MetaMask injected object (if metamask is installed)
            const metaMaskEthProvider = window.ethereumXXX;
            console.log('@1')

            let web3 = {};
            if (metaMaskEthProvider) {
                console.log('Detected injected MetaMask Ethereum Provider');
                // use MetaMask's provider
                web3 = new Web3(metaMaskEthProvider);
                console.log('Obtained a MetaMask injected provider');
                await metaMaskEthProvider.enable(); // get permission to access accounts
                console.log('Obtained permission to use MetaMask accounts')
            } else {
                console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
                // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
                web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
            }

            let accounts;
            let instance;
            try {
                // get contract instance
                const networkId = await web3.eth.net.getId();
                console.log('networkId is ', networkId);
                const deployedNetwork = starNotaryArtifact.networks[networkId];
                console.log('Deployed Network is ', deployedNetwork);
                instance = new web3.eth.Contract(
                    starNotaryArtifact.abi,
                    deployedNetwork.address,
                );
                // console.log('@4',instance.deployed())

                // get accounts
                accounts = await web3.eth.getAccounts();
                console.log('Got accounts', accounts)
                const account = accounts[0];
                // TODO: Remove hardcoding!!!
                // const account = "0xBE336f17483b8f9644961b6418fC8B9db4e50551";
                console.log('Account is', account)
                console.log('Instance is', instance)
                const balance = web3.eth.getBalance(account);
                console.log('balance is', balance);

                this.setState({web3, instance, account});

                // this.setState({storageValue: 3, account:accounts[0], tokenId:null})
            } catch (error) {
                console.error("Could not connect to contract or chain.");
            }


            /*
            // Get network provider and web3 instance.
            // const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
              SimpleStorageContract.abi,
              deployedNetwork && deployedNetwork.address,
            );
      */
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    // runExample = async () => {
    //   console.log(this.state);
    //   const { accounts, contract } = this.state;
    //
    //   // Stores a given value, 5 by default.
    //   await contract.methods.set(3).send({ from: accounts[0] });
    //
    //   // Get the value from the contract to prove it worked.
    //   const response = await contract.methods.get().call();
    //
    //   // Update state with the result.
    //   this.setState({ storageValue: response });
    // };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>
                <p>
                    If your contracts compiled and migrated successfully, below will show
                    a stored value of 5 (by default).
                </p>
                <p>
                    Try changing the value stored on <strong>line 40</strong> of App.js.
                </p>
                <div>The stored value is: {this.state.storageValue}</div>
                <hr/>
                <Tabs defaultActiveKey="claim">
                    <Tab eventKey="claim" title="Claim">
                        <ClaimStar instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                    <Tab eventKey="lookup" title="Lookup">
                        <LookupStar instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                    <Tab eventKey="sell" title="Sell">
                        <SellStar instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                    <Tab eventKey="buy" title="Buy">
                        <BuyStar instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default App;

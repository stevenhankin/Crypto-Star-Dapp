import React, { Component } from "react";
// import getWeb3 from "./utils/getWeb3";
import Web3 from "web3";

import "./App.css";
import starNotaryArtifact from "./contracts/StarNotary";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {


      console.log('@1')

      let web3={};
      if (window.ethereum) {
        console.log('@2')
        // use MetaMask's provider
         web3 = new Web3(window.ethereum);
        console.log('@2.1')
        await window.ethereum.enable(); // get permission to access accounts
        console.log('@2,2')
      } else {
        console.log('@3')
        console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
         web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
      }

      let accounts ;
      let instance;
      try {
        // get contract instance
        console.log('@3')
        const networkId = await web3.eth.net.getId();
        console.log('@3.1')
        const deployedNetwork = starNotaryArtifact.networks[networkId];
        console.log('@3,2')
        instance = new web3.eth.Contract(
            starNotaryArtifact.abi,
            deployedNetwork.address,
        );
        console.log('@4')

        // get accounts
         accounts = await web3.eth.getAccounts();
        this.account = accounts[0];
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
      this.setState({ web3, accounts, contract: instance }, this.runExample);

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
      </div>
    );
  }
}

export default App;

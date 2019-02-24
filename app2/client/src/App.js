import React, {Component} from "react";
import StarClaim from "./StarClaim";
import StarLookup from "./StarLookup";
import StarSell from "./StarSell";
import BuyStar from "./StarBuy";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Web3 from "web3";

import starNotaryArtifact from "./contracts/StarNotary";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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


    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <Container>
                <Jumbotron>
                    <Row>
                        <Col>
                            <h1>Crypto Star Notary</h1>
                            <p class="lead">A decentralized app running on the Ethereum Blockchain</p>
                            <p>This app utilises a non-fungible "SUN" token, defined in its solidity contract</p>
                        </Col>
                        <Col>
                            <Image
                                fluid
                                rounded
                                src="https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9"/>
                        </Col>
                    </Row>
                </Jumbotron>
                <Tabs defaultActiveKey="claim">
                    <Tab eventKey="claim" title="Claim">
                        <StarClaim instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                    <Tab eventKey="lookup" title="Lookup">
                        <StarLookup instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                    <Tab eventKey="sell" title="Sell">
                        <StarSell instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                    <Tab eventKey="buy" title="Buy">
                        <BuyStar instance={this.state.instance} account={this.state.account}/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default App;

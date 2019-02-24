import React, {useEffect, useState} from "react";
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
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import EthereumIcon from './resources/Ethereum_logo_2014.svg';

function App() {

    const [web3, setWeb3] = useState();
    const [instance, setInstance] = useState();
    const [accounts, setAccounts] = useState();
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();


    async function getProvider() {
        console.log('HERE')
        const metaMaskEthProvider = window.ethereum;
        if (metaMaskEthProvider) {
            console.log('Detected injected MetaMask Ethereum Provider');
            // use MetaMask's provider
            setWeb3(new Web3(metaMaskEthProvider));
            console.log('Obtained a MetaMask injected provider');
            await metaMaskEthProvider.enable(); // get permission to access accounts
            console.log('Obtained permission to use MetaMask accounts')
        } else {
            console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            setWeb3(new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),));
        }
    }


    async function getInstance() {
        if (web3) {
            try {
                // get contract instance
                const networkId = await web3.eth.net.getId();
                console.log('networkId is ', networkId);
                const deployedNetwork = starNotaryArtifact.networks[networkId];
                console.log('Deployed Network is ', deployedNetwork);
                let _instance = new web3.eth.Contract(
                    starNotaryArtifact.abi,
                    deployedNetwork.address,
                );
                setInstance(_instance);
                console.log('*** SET INSTANCE ', _instance)
            } catch (error) {
                console.error("Could not connect to contract");
            }
        }

    }

    async function getAccounts() {
        if (web3) {
            const _accounts = await web3.eth.getAccounts();
            console.log('Got accounts', _accounts)
            setAccounts(_accounts);
            const _account = _accounts[0];
            setAccount(_account);
            console.log('Account is', _account)
            // console.log('Instance is', instance)
            const _balance = await web3.eth.getBalance(_account);
            setBalance(_balance);
        }
    }

    /**
     * Get the web3 provider
     */
    useEffect(() => {
        getProvider()
    }, []);

    /**
     * Once web3 has been set, the contract instance and accounts can be obtained
     */
    useEffect(() => {
        getInstance();
        getAccounts();
    }, [web3]);


    function test(_account) {
        return async () => {
            setAccount(_account);
            const _balance = await web3.eth.getBalance(_account);
            setBalance(_balance);
        }
    }

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <Container>
            <Jumbotron>
                <Row>
                    <Col>
                        <h1>Crypto Star Notary</h1>
                        <p className="lead">A decentralized app running on the Ethereum Blockchain</p>
                        <p>This app utilises a non-fungible "SUN" token, defined in its solidity contract</p>
                        <hr/>
                        <Container>
                            <Row>
                                <Col xs={4}>
                                    <DropdownButton title={"Account"} size={"sm"}>
                                        {accounts && accounts
                                            .map(x =>
                                                <DropdownItem key={x} onClick={test(x)}>
                                                    {x.substring(0, 8) + "..." + x.substring(x.length - 8)}
                                                </DropdownItem>)}
                                    </DropdownButton>
                                </Col>
                                <Col><Image src={EthereumIcon} height={24}/> {balance || "unknown"}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col>
                        <Image
                            fluid
                            rounded
                            src={"https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib="
                            + "rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9"}/>
                    </Col>
                </Row>
            </Jumbotron>

            <Tabs defaultActiveKey="claim">
                <Tab eventKey="claim" title="Claim">
                    <StarClaim instance={instance} account={account}/>
                </Tab>
                <Tab eventKey="lookup" title="Lookup">
                    <StarLookup instance={instance}/>
                </Tab>
                <Tab eventKey="sell" title="Sell">
                    <StarSell instance={instance} account={account}/>
                </Tab>
                <Tab eventKey="buy" title="Buy">
                    <BuyStar instance={instance} account={account}/>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default App;

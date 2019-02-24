import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import RIPEMD160 from 'ripemd160';
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Spinner from './resources/spinner.svg';

function StarClaim(props) {

    /* State Hooks */
    const [starName, setStarName] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [alert, setAlert] = useState([]);
    const [waiting, setWaiting] = useState(false);

    /* Custom state hooks */
    const story = useFormInput('');
    const declination = useFormInput(0);
    const raHours = useFormInput(0);
    const raMinutes = useFormInput(0);
    const raSeconds = useFormInput(0);
    const constellation = useFormInput();


    const constellations = ['Andromeda', 'Antlia', 'Apus', 'Aquarius', 'Aquila', 'Ara', 'Aries', 'Auriga', 'Boötes',
        'Caelum', 'Camelopardalis', 'Cancer', 'Canes Venatici', 'Canis Major', 'Canis Minor', 'Capricornus', 'Carina',
        'Cassiopeia', 'Centaurus', 'Cepheus', 'Cetus', 'Chamaeleon', 'Circinus', 'Columba', 'Coma Berenices',
        'Corona Australis', 'Corona Borealis', 'Corvus', 'Crater', 'Crux', 'Cygnus', 'Delphinus', 'Dorado', 'Draco',
        'Equuleus', 'Eridanus', 'Fornax', 'Gemini', 'Grus', 'Hercules', 'Horologium', 'Hydra', 'Hydrus', 'Indus',
        'Lacerta', 'Leo', 'Leo Minor', 'Lepus', 'Libra', 'Lupus', 'Lynx', 'Lyra', 'Mensa', 'Microscopium', 'Monoceros',
        'Musca', 'Norma', 'Octans', 'Ophiuchus', 'Orion', 'Pavo', 'Pegasus', 'Perseus', 'Phoenix', 'Pictor', 'Pisces',
        'Piscis Austrinus', 'Puppis', 'Pyxis', 'Reticulum', 'Sagitta', 'Sagittarius', 'Scorpius', 'Sculptor', 'Scutum',
        'Serpens', 'Sextans', 'Taurus', 'Telescopium', 'Triangulum', 'Triangulum Australe', 'Tucana', 'Ursa Major',
        'Ursa Minor', 'Vela', 'Virgo', 'Volans', 'Vulpecula'
    ];


    /**
     * Display a bootstrap alert for info
     * Timesout and disappears after a few seconds
     * @param msgObj
     */
    function alertMsg(msgObj) {
        const futureTimeout = Date.now() + 4000;
        const newAlertList = alert.concat({timeout: futureTimeout, ...msgObj});
        setAlert(newAlertList);
        setTimeout(() => {
            setAlert(alert.filter(a => a.timeout > Date.now()));
        }, 5000);
    }

    /**
     * Calculate a unique token from a shortened hash of the sanitized name
     * Obviously since the hash is shortened, there is a collision risk, but should be small
     *
     * @param name - name of star
     */
    function calculateToken(name) {
        let shortHash = "";
        if (name) {
            // Ensure that the "same" name, irrespective of spacing
            // or case, will yield the same token
            const sanitizedStr = name.replace(/\W/g, '').toUpperCase();
            shortHash = new RIPEMD160().update(sanitizedStr).digest('hex').slice(0, 10);
            console.log(`${sanitizedStr} new hash ${shortHash}`)
        } else {
            // When the star name is empty, we don't want to display
            // a token id because that would be confusing
            shortHash = "";
        }
        console.log(`setting token, was ${tokenId}`)
        setTokenId(shortHash);
    }


    /**
     * Wrapper for calling the Solidity method to create a star
     * @return {Promise<void>}
     */
    async function callCreateStar() {
        const {createStar, lookUptokenIdToStarInfo} = props.instance.methods;
        const intTokenId = parseInt(tokenId, 16);
        // Don't attempt to create a star that already exists
        // because it will just get rejected by the StarNotary contract anyway
        console.log('calling lookUptokenIdToStarInfo');
        let starInfo = "";
        try {
            starInfo = await lookUptokenIdToStarInfo(intTokenId).call();
            console.log('done');
            if (starInfo.length > 0) {
                alertMsg({msg: `Star already claimed with token ${tokenId}`, variant: "primary"});
            } else {
                console.log('starInfo:', starInfo);
                // Call the contract to create a star claim with the specified name (and derived hash)
                try {
                    alertMsg({msg: "Submitted...", variant: "info"});
                    let receipt = await createStar(starName, intTokenId).send({from: props.account, gas: 500000});
                    if (receipt.transactionHash) {
                        alertMsg({msg: `Confirmed ✅ Created with token ${tokenId}`, variant: "success"});
                    }
                } catch (err) {
                    alertMsg({msg: "Failed", variant: "primary"})
                }
            }
        } catch (e) {
            console.error('lookUptokenIdToStarInfo failed', e);
            alertMsg({
                msg: "Unexpected error.  Hint: If using development network you may need to 'migrate --reset' the contract in truffle 😊",
                variant: "primary"
            })
        }
    }


    /**
     * Generic state hook for most of the form fields
     *
     * @param initialValue
     * @return {{onChange: onChange, value: any}}
     */
    function useFormInput(initialValue) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value)
        }

        return {value, onChange};
    }


    /**
     * Clicking the "Claim Star" button will call the wrapper to create a star
     * and produce a Spinner until finished
     *
     * @param event
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        setWaiting(true);
        callCreateStar()
            .then(() => setWaiting(false))
    };

    /**
     * Star name change needs to be handle separately since we are also calculating the token hash
     * @param e
     */
    function handleStarNameChange(e) {
        const name = e.target.value;
        setStarName(name);
        calculateToken(name);
    }

    console.log("in StarClaim, the instance is", props.instance)

    return (
        <React.Fragment>
            <Form onSubmit={handleSubmit}>

                <h6 style={{paddingTop: 20, paddingBottom: 20}}>A star is given a unique token based on its name.
                    Once claimed, you'll be able to sell it</h6>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Name</Form.Label>
                    <Col sm={10} md={6}>
                        <InputGroup>

                            <Form.Control type="text" onChange={handleStarNameChange}
                                          placeholder="Enter name of your star"/>
                            <InputGroup.Append>
                                <InputGroup.Text>{tokenId || "Token ID"}</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>

                </Form.Group>

                <Form.Group as={Row} controlId="validationStory">
                    <Form.Label column="true" sm="2">Story</Form.Label>
                    <Col sm={10} md="6">
                        <Form.Control type="text" {...story}
                                      placeholder="Mention why this star is important to you"/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Declination</Form.Label>
                    <Col sm="3" md="2">
                        <Form.Control {...declination} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Right Ascension</Form.Label>
                    <Col sm="3" md="2">
                        <InputGroup>
                            <InputGroup.Append>
                                <InputGroup.Text id="hrs-addon">hrs</InputGroup.Text>
                            </InputGroup.Append>
                            <Form.Control type="text" aria-describedby="hrs-addon" {...raHours}/>
                        </InputGroup>
                    </Col>
                    <Col sm="3" md="2">
                        <InputGroup>
                            <InputGroup.Append>
                                <InputGroup.Text id="sec-addon">sec</InputGroup.Text>
                            </InputGroup.Append>
                            <Form.Control type="text" {...raMinutes}/>
                        </InputGroup>
                    </Col>
                    <Col sm="3" md="2">
                        <InputGroup>
                            <InputGroup.Append>
                                <InputGroup.Text id="min-addon">min</InputGroup.Text>
                            </InputGroup.Append>
                            <Form.Control type="text" {...raSeconds}/>
                        </InputGroup>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Constellation</Form.Label>
                    <Col sm={9} md={6}>
                        <Form.Control as="select" {...constellation}>
                            {constellations.map(x => <option key={x}>{x}</option>)}
                        </Form.Control>
                    </Col>
                </Form.Group>


                <Form.Group as={Row}>
                    <Col sm="2">
                        <Button type="submit" disabled={!starName || waiting}>Claim Star</Button>
                    </Col>

                    <Col sm="6">

                        <Image hidden={!waiting} src={Spinner} height={48}/>

                        {alert.map((item, i) => {
                            return <Alert key={i} variant={item.variant}>
                                {item.msg}
                            </Alert>

                        })}
                    </Col>
                </Form.Group>

            </Form>

        </React.Fragment>
    );
}

export default StarClaim;



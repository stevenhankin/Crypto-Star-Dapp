import React, {useState, useEffect} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";

import RIPEMD160 from 'ripemd160';

function ClaimStar(props) {

    /* State Hooks */
    const [account] = useState(props.account);
    const [instance] = useState(props.instance);
    const [starName, setStarName] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [alert, setAlert] = useState({});

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
        setAlert(msgObj);
        setTimeout(() => {
            setAlert({})
        }, 3000);
    }

    /**
     * Calculate a token from a shortened hash of the sanitized name
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

    function handleStarNameChange(e) {
        const name = e.target.value;
        setStarName(name);
        calculateToken(name);
    }

    async function callCreateStar() {
        const {createStar, lookUptokenIdToStarInfo} = instance.methods;
        const intTokenId = parseInt(tokenId, 16);
        // Don't attempt to create a star that already exists
        // because it will just get rejected by the StarNotary contract anyway
        let starInfo = await lookUptokenIdToStarInfo(intTokenId).call();
        if (starInfo.length > 0) {
            alertMsg({msg: `Star already claimed with token ${tokenId}`, variant: "primary"});
        } else {
            console.log('starInfo:', starInfo);
            // Call the contract to create a star claim with the specified name (and derived hash)
            try {
                alertMsg({msg: "Submitted...", variant: "info"});
                // await createStar(name, tokenId).call({from: account});
                let receipt = await createStar(starName, intTokenId).send({from: account, gas: 500000});
                if (receipt.transactionHash) {
                    alertMsg({msg: `Confirmed ✅ Created with token ${tokenId}`, variant: "success"});
                }
            } catch (err) {
                alertMsg({msg: "Failed", variant: "primary"})
            }
            // // Get the star info back to display to the user
            // const starInfo = await lookUptokenIdToStarInfo(starNameHash).call({from: account});
            // console.log('starInfo', JSON.stringify(starInfo));
        }
    }

    function useFormInput(initialValue) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value)
        }

        return {value, onChange};
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            callCreateStar()
                .then(() => console.log('created star'))
        }
    };


    return (
        <div>
            <h2>Claim</h2>
            <Form onSubmit={handleSubmit}>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Name</Form.Label>
                    <Col sm={4}>
                        <InputGroup>

                            <Form.Control type="text" onChange={handleStarNameChange}
                                          placeholder="Enter the name of your star here"/>
                            <InputGroup.Append>
                                <InputGroup.Text>{tokenId || "Token ID"}</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>

                </Form.Group>

                <Form.Group as={Row} controlId="validationStory">
                    <Form.Label column="true" sm="2">Story</Form.Label>
                    <Col sm="9">
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
                        <input type="submit" value="Claim now!" disabled={!starName}/>
                    </Col>

                    <Col sm="6">
                        <Alert variant={alert.variant}>
                            {alert.msg}
                        </Alert>
                    </Col>
                </Form.Group>

            </Form>

        </div>
    );
}

export default ClaimStar;



import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";

// const RIPEMD160 = require('ripemd160')
import RIPEMD160 from 'ripemd160';

function ClaimStar(props) {

    /* State Hooks */
    const [account] = useState(props.account);
    const [instance] = useState(props.instance);
    const [starName, setStarName] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [requestStatus, setRequestStatus] = useState('');

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

    // const callCreateStar = async (account) => {
    async function callCreateStar() {
        const name = starName;
        console.log('CREATING A STAR!', name, account);
        const {createStar} = instance.methods;
        // Create a Hash for the star based on its name
        console.log('TOKEN',tokenId);
        const shortHash = tokenId; // new RIPEMD160().update(name).digest('hex').slice(0, 10);
        // Call the contract to create a star claim with the specified name (and derived hash)
        console.log(name, shortHash);
        try {
            console.log({from: account});
            setRequestStatus("Submitted...");
            console.log('parsed hash is',parseInt(shortHash, 16))
            console.log('account is',account);
            console.log('name is',name);
            const tokenId = 1;//parseInt(shortHash, 16);
            console.log(`Claiming star ${name} for id ${tokenId} using account ${account}`);
            await createStar(name, tokenId).call({from: account});
            console.log(JSON.stringify(shortHash));
            setRequestStatus(`Confirmed ✅  (${name} has ID ${shortHash})`)
        } catch (err) {
            console.error("FAILURE!", err)
            setRequestStatus("Failed")
        }
        // // Get the star info back to display to the user
        // const starInfo = await lookUptokenIdToStarInfo(starNameHash).call({from: account});
        // console.log('starInfo', JSON.stringify(starInfo));
    };

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

    // render() {
    return (
        <div>
            <h2>Claim</h2>
            <Form onSubmit={handleSubmit}>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Name</Form.Label>
                    <Col sm={5}>
                        <Form.Control type="text" onChange={handleStarNameChange}
                                      placeholder="Enter the name of your star here"/>
                    </Col>
                    <Col sm={4}>
                        <Form.Control readOnly  type="text" value={tokenId}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="validationStory">
                    <Form.Label column="true" sm="2">Story</Form.Label>
                    <Col sm="9">
                        <Form.Control required type="text" {...story}
                                      placeholder="Mention why this star is important to you"/>
                        <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
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

                <Col sm="2">
                    <input type="submit" value="Claim now!" disabled={!starName}/>
                </Col>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Status</Form.Label>
                    <Form.Label column="true" sm="5">{requestStatus}</Form.Label>
                </Form.Group>

            </Form>

        </div>
    );
}

export default ClaimStar;



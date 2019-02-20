import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";

// const RIPEMD160 = require('ripemd160')
import RIPEMD160 from 'ripemd160';
import Button from "react-bootstrap/Button";

function LookupStar(props) {

    /* State Hooks */
    const [account] = useState(props.account);
    const [instance] = useState(props.instance);
    const [starName, setStarName] = useState('');
    const [requestStatus, setRequestStatus] = useState('');

    /* Custom state hooks */
    const tokenHash = useFormInput('');
    const story = useFormInput('');
    const declination = useFormInput(0);
    const raHours = useFormInput(0);
    const raMinutes = useFormInput(0);
    const raSeconds = useFormInput(0);
    const constellation = useFormInput();


    async function lookupStarByToken() {
        const {lookUptokenIdToStarInfo} = instance.methods;
        const tokenId = parseInt(tokenHash.value, 16);
        console.log(`Looking up star for token ${tokenId} from account ${account}`)
        if (isNaN(tokenId)) {
            console.log('NaN!!!!!')
        } else {
            let starInfo = await lookUptokenIdToStarInfo(tokenId).call();
            setStarName(starInfo);
        }

        // // Create a Hash for the star based on its name
        // const shortHash = new RIPEMD160().update(name).digest('hex').slice(0, 10);
        // // Call the contract to create a star claim with the specified name (and derived hash)
        // console.log(name, shortHash);
        // try {
        //     console.log({from: account});
        //     setRequestStatus("Submitted...");
        //     await createStar(name, parseInt(shortHash, 16)).call({from: account});
        //     console.log(JSON.stringify(shortHash));
        //     setRequestStatus(`Confirmed ✅  (${name} has ID ${shortHash})`)
        // } catch (err) {
        //     console.error("FAILURE!", err)
        //     setRequestStatus("Failed")
        // }
        // // Get the star info back to display to the user
        // const starInfo = await lookUptokenIdToStarInfo(starNameHash).call({from: account});
        // console.log('starInfo', JSON.stringify(starInfo));
    }

    function useFormInput(initialValue) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value)
            setStarName('')
        }

        return {value, onChange};
    }

    const handleSubmit = (event) => {

        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            lookupStarByToken()
                .then(() => console.log('found star'))
        }
    };

    return (
        <div>
            <h2>Find a star</h2>
            <Form onSubmit={handleSubmit}>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Token</Form.Label>
                    <Col sm={5}>
                        <Form.Control type="text" {...tokenHash}
                                      placeholder="Enter the token id for the star you are interested in"/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">
                        <Button type="submit" disabled={!tokenHash.value}>Lookup</Button>
                    </Form.Label>
                </Form.Group>

                <Form.Group hidden={!starName}>
                    <Form.Group as={Row}>
                        <Form.Label column="true" sm="2">Token</Form.Label>
                        <div sm="5">
                            <input type="text" readOnly value={tokenHash.value}/>
                        </div>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column="true" sm="2">Name</Form.Label>
                        <div sm="5">
                            <input type="text" readOnly value={starName}/>
                        </div>
                    </Form.Group>
                </Form.Group>

                {/*<Form.Group as={Row}>*/}
                {/*<Form.Label column="true" sm="2">Name</Form.Label>*/}
                {/*<Col sm={5}>*/}
                {/*<Form.Control type="text" onChange={handleStarNameChange}*/}
                {/*placeholder="Enter the name of your star here"/>*/}
                {/*</Col>*/}
                {/*</Form.Group>*/}

                {/*<Form.Group as={Row} controlId="validationStory">*/}
                {/*<Form.Label column="true" sm="2">Story</Form.Label>*/}
                {/*<Col sm="9">*/}
                {/*<Form.Control required type="text" {...story}*/}
                {/*placeholder="Mention why this star is important to you"/>*/}
                {/*<Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>*/}
                {/*</Col>*/}
                {/*</Form.Group>*/}

                {/*<Form.Group as={Row}>*/}
                {/*<Form.Label column="true" sm="2">Declination</Form.Label>*/}
                {/*<Col sm="3" md="2">*/}
                {/*<Form.Control {...declination} />*/}
                {/*</Col>*/}
                {/*</Form.Group>*/}

                {/*<Form.Group as={Row}>*/}
                {/*<Form.Label column="true" sm="2">Right Ascension</Form.Label>*/}
                {/*<Col sm="3" md="2">*/}
                {/*<InputGroup>*/}
                {/*<InputGroup.Append>*/}
                {/*<InputGroup.Text id="hrs-addon">hrs</InputGroup.Text>*/}
                {/*</InputGroup.Append>*/}
                {/*<Form.Control type="text" aria-describedby="hrs-addon" {...raHours}/>*/}
                {/*</InputGroup>*/}
                {/*</Col>*/}
                {/*<Col sm="3" md="2">*/}
                {/*<InputGroup>*/}
                {/*<InputGroup.Append>*/}
                {/*<InputGroup.Text id="sec-addon">sec</InputGroup.Text>*/}
                {/*</InputGroup.Append>*/}
                {/*<Form.Control type="text" {...raMinutes}/>*/}
                {/*</InputGroup>*/}
                {/*</Col>*/}
                {/*<Col sm="3" md="2">*/}
                {/*<InputGroup>*/}
                {/*<InputGroup.Append>*/}
                {/*<InputGroup.Text id="min-addon">min</InputGroup.Text>*/}
                {/*</InputGroup.Append>*/}
                {/*<Form.Control type="text" {...raSeconds}/>*/}
                {/*</InputGroup>*/}
                {/*</Col>*/}
                {/*</Form.Group>*/}

                {/*<Form.Group as={Row}>*/}
                {/*<Form.Label column="true" sm="2">Constellation</Form.Label>*/}
                {/*<Col sm={9} md={6}>*/}
                {/*<Form.Control as="select" {...constellation}>*/}
                {/*{constellations.map(x => <option>{x}</option>)}*/}
                {/*</Form.Control>*/}
                {/*</Col>*/}
                {/*</Form.Group>*/}


                {/*<Form.Group as={Row}>*/}
                {/*<Form.Label column="true" sm="2">Status</Form.Label>*/}
                {/*<Form.Label column="true" sm="5">{requestStatus}</Form.Label>*/}
                {/*</Form.Group>*/}

            </Form>

        </div>
    );
}

export default LookupStar;



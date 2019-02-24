import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

function StarLookup(props) {

    /* State Hooks */
    const [starName, setStarName] = useState('');
    const [alert, setAlert] = useState([]);

    /* Custom state hooks */
    const tokenHash = useFormInput('');

    /**
     * Display a bootstrap alert for info
     * Timesout and disappears after a few seconds
     * @param msgObj
     */
    function alertMsg(msgObj) {
        const futureTimeout = Date.now() + 4000;
        console.log('adding a msg', msgObj)
        const newAlertList = alert.concat({timeout: futureTimeout, ...msgObj});
        setAlert(newAlertList);
        setTimeout(() => {
            setAlert(alert.filter(a => a.timeout > Date.now()));
        }, 4500);
    }


    async function lookupStarByToken() {
        const {lookUptokenIdToStarInfo} = props.instance.methods;
        const tokenId = parseInt(tokenHash.value, 16);
        if (isNaN(tokenId)) {
            alertMsg({msg: `Invalid token`, variant: 'warning'});
        } else {
            try {
                let starInfo = await lookUptokenIdToStarInfo(tokenId).call();
                setStarName(starInfo);
                if (!starInfo) {
                    alertMsg({msg: `${tokenId} doesn't exist`, variant: 'warning'});
                }
            } catch (e) {
                console.error('lookUptokenIdToStarInfo failed', e);
                alertMsg({
                    msg: "Unable to retrieve star",
                    variant: "primary"
                })
            }
        }
    }

    function useFormInput(initialValue) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value)
            setStarName('')
        }

        return {value, onChange};
    }

    /**
     *
     * @param event
     */
    const handleLookup = (event) => {
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
            <Form onSubmit={handleLookup}>

                <h6 style={{paddingTop: 20, paddingBottom: 20}}>Searching for a token of a claimed star
                    will display its name</h6>


                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Token</Form.Label>
                    <Col sm={5}>
                        <Form.Control type="text" {...tokenHash}
                                      placeholder="ID of star you're interested in"/>
                    </Col>
                </Form.Group>


                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">
                        <Button type="submit" disabled={!tokenHash.value}>Lookup</Button>
                    </Form.Label>

                    <Col sm={6}>
                        {alert.map((item, i) => {
                            return <Alert key={i} variant={item.variant}>
                                {item.msg}
                            </Alert>

                        })}
                    </Col>
                </Form.Group>


                <Card hidden={!starName}>
                    <Card.Body>
                        <Card.Title>This star has been claimed</Card.Title>
                        <Card.Text>Token {tokenHash.value} represents a star called {starName}</Card.Text>
                    </Card.Body>
                </Card>

            </Form>

    );
}

export default StarLookup;



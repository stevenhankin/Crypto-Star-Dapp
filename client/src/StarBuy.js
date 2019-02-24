import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function StarBuy(props) {

    /* State Hooks */
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
        }, 5000);
    }

    /**
     * Buy a star via the appropriate method on the contract
     * but first make some simple data checks to prevent
     * unnecessary gas burning
     * @return {Promise<void>}
     */
    async function buyStarByToken() {
        const {lookUptokenIdToStarInfo, buyStar} = props.instance.methods;
        const tokenId = parseInt(tokenHash.value, 16);
        if (isNaN(tokenId)) {
            alertMsg({msg: `${tokenHash.value} is not a valid ID`, variant: 'warning'});
        } else {
            try {
                // Let's see if the star exists
                const starInfo = await lookUptokenIdToStarInfo(tokenId).call();
                if (starInfo) {
                    console.log('Using account', props.account);
                    await buyStar(tokenId).send({from: props.account, gas: 500000});
                    alertMsg({msg: `✅ ${starInfo} has been put up for sale`, variant: 'success'});
                } else {
                    alertMsg({msg: `${tokenHash.value} doesn't exist`, variant: 'warning'});
                }
            } catch (e) {
                console.error('putStarUpForSale failed', e);
                alertMsg({
                    msg: "Unexpected error.  Hint: If using development network you may need to 'migrate --reset' the contract in truffle 😊",
                    variant: "primary"
                })
            }
        }
    }

    /**
     * Generic form input state hook
     * @param initialValue
     * @return {{onChange: onChange, value: any}}
     */
    function useFormInput(initialValue) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value);
        }

        return {value, onChange};
    }

    /**
     * Sell the star when the button is clicked
     * @param event
     */
    const handlePurchase = (event) => {
        event.preventDefault();
        buyStarByToken().then(() => console.log('put star up for sale'))
    };

    return (
        <Form onSubmit={handlePurchase}>

            <h6 style={{paddingTop: 20, paddingBottom: 20}}>A claimed star that has been
                put up for sale can be purchased here</h6>


            <Form.Group as={Row}>
                <Form.Label column="true" sm="2">Token</Form.Label>
                <Col sm={5}>
                    <Form.Control type="text" {...tokenHash}
                                  placeholder="ID of your star"/>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column="true" sm="2">
                    <Button type="submit" disabled={!tokenHash.value}>Buy Star</Button>
                </Form.Label>

                <Col sm="6">
                    {alert.map((item, i) => {
                        return <Alert key={i} variant={item.variant}>
                            {item.msg}
                        </Alert>

                    })}
                </Col>
            </Form.Group>

        </Form>

    );
}


export default StarBuy;


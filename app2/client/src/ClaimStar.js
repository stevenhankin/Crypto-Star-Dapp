import React, {Component} from "react";
// import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/es/FormLabel";
import FormControl from "react-bootstrap/FormControl"
import FormText from "react-bootstrap/FormText";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

const createKeccakHash = require('keccak')

class ClaimStar extends Component {

    constructor(props) {
        super(props);
        this.state = {starName: props.name, instance: props.instance, account: props.account, requestStatus: "New"};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({starName: event.target.value, requestStatus: "New"});
    }

    async createStar(starName, account) {
        console.log(starName, account);
        const {createStar, lookUptokenIdToStarInfo} = this.state.instance.methods;
        // Create a Hash for the star based on its name
        const starNameHash = createKeccakHash('keccak256').update(starName).digest();
        // Call the contract to create a star claim with the specified name (and derived hash)
        console.log(starName, starNameHash);
        try {
            console.log({from: account})
            this.setState({requestStatus: "Submitted..."});
            await createStar(starName, starNameHash).call({from: account});
            this.setState({requestStatus: "Confirmed ✅"})
        } catch (err) {
            console.error("FAILURE!", err)
            this.setState({requestStatus: "Failed"})
        }
        // // Get the star info back to display to the user
        // const starInfo = await lookUptokenIdToStarInfo(starNameHash).call({from: account});
        // console.log('starInfo', JSON.stringify(starInfo));
    }

    handleSubmit(event) {
        event.preventDefault();
        this.createStar(this.state.starName, this.state.account)
            .then(() => console.log('created star'))
    }

    render() {
        return (
            <Container>
                <h2>Claim a star</h2>
                <Form onSubmit={this.handleSubmit}>

                    <Form.Group as={Row}>
                        <Form.Label column="true" sm="2">Name</Form.Label>
                        <Form.Control column="true" sm="5" type="text" name="starName" onChange={this.handleChange}/>
                        <input type="submit" value="Claim now!" disabled={!this.state.starName}/>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column="true" sm="2">Status</Form.Label>
                        <Form.Label column="true" sm="5">{this.state.requestStatus}</Form.Label>
                    </Form.Group>
                    
                </Form>

            </Container>
        );
    }
}

export default ClaimStar;

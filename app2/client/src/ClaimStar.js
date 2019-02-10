import React, {Component} from "react";

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
            await createStar(starName, starNameHash).send({from: account});
            this.setState({requestStatus: "Confirmed ✅"})
        } catch (err) {
            console.error("FAILURE!",err)
            this.setState({requestStatus: "Failed"})
        }
            // // Get the star info back to display to the user
            // const starInfo = await lookUptokenIdToStarInfo(starNameHash).call({from: account});
            // console.log('starInfo', JSON.stringify(starInfo));
    }

    handleSubmit(event) {
        event.preventDefault();
        this.createStar(this.state.starName, this.state.account)
    }

    render() {
        return (
            <div>
                <h2>Claim a star</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="starName" onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Claim now!" disabled={!this.state.starName} />
                </form>

                Status: {this.state.requestStatus}

            </div>
        );
    }
}

export default ClaimStar;

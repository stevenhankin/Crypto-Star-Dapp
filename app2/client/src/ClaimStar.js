import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const RIPEMD160 = require('ripemd160')

function ClaimStar(props) {

    /* State Hooks */
    const [account] = useState(props.account);
    const [instance] = useState(props.instance);
    const [requestStatus, setRequestStatus] = useState('');

    /* Custom state hooks */
    const starName = useFormInput('');
    const story = useFormInput('');
    const declination = useFormInput(0);
    const raHours = useFormInput(0);
    const raMinutes = useFormInput(0);
    const raSeconds = useFormInput(0);
    const constellation = useFormInput();

    // const callCreateStar = async (account) => {
    async function     callCreateStar (account) {
        const name = starName.value;
        console.log('CREATING A STAR!', name, account);
        const {createStar, lookUptokenIdToStarInfo} = instance.methods;
        // Create a Hash for the star based on its name
        const starNameHash = new RIPEMD160().update(name).digest();
        // Call the contract to create a star claim with the specified name (and derived hash)
        console.log(name, starNameHash);
        try {
            console.log({from: account});
            setRequestStatus("Submitted...");
            await createStar(name, starNameHash).call({from: account});
            console.log(JSON.stringify(starNameHash));
            setRequestStatus(`Confirmed ✅  (${name} has ID ${starNameHash.toString('hex')})`)
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
            callCreateStar(account)
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
                    <Col sm="5">
                        <Form.Control type="text" {...starName} placeholder="Enter the name of your star here"/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="validationStory">
                    <Form.Label column="true" sm="2">Story</Form.Label>
                    <Col sm="5">
                        <Form.Control required type="text" {...story}
                                      placeholder="Mention why this star is important to you"/>
                        <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Declination</Form.Label>
                    <Col sm="5">
                        <Form.Control {...declination} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Right Ascension</Form.Label>
                    <Col sm="2">
                        <Form.Control type="text" {...raHours}/>
                    </Col>
                    <Col sm="2">
                        <Form.Control type="text" {...raMinutes}/>
                    </Col>
                    <Col sm="2">
                        <Form.Control type="text" {...raSeconds}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column="true" sm="2">Constellation</Form.Label>
                    <Col sm="5">
                        <Form.Control as="select" {...constellation}>
                            <option>Andromeda</option>
                            <option>Antlia</option>
                            <option>Apus</option>
                            <option>Aquarius</option>
                            <option>Aquila</option>
                            <option>Ara</option>
                            <option>Aries</option>
                            <option>Auriga</option>
                            <option>Boötes</option>
                            <option>Caelum</option>
                            <option>Camelopardalis</option>
                            <option>Cancer</option>
                            <option>Canes Venatici</option>
                            <option>Canis Major</option>
                            <option>Canis Minor</option>
                            <option>Capricornus</option>
                            <option>Carina</option>
                            <option>Cassiopeia</option>
                            <option>Centaurus</option>
                            <option>Cepheus</option>
                            <option>Cetus</option>
                            <option>Chamaeleon</option>
                            <option>Circinus</option>
                            <option>Columba</option>
                            <option>Coma Berenices</option>
                            <option>Corona Australis</option>
                            <option>Corona Borealis</option>
                            <option>Corvus</option>
                            <option>Crater</option>
                            <option>Crux</option>
                            <option>Cygnus</option>
                            <option>Delphinus</option>
                            <option>Dorado</option>
                            <option>Draco</option>
                            <option>Equuleus</option>
                            <option>Eridanus</option>
                            <option>Fornax</option>
                            <option>Gemini</option>
                            <option>Grus</option>
                            <option>Hercules</option>
                            <option>Horologium</option>
                            <option>Hydra</option>
                            <option>Hydrus</option>
                            <option>Indus</option>
                            <option>Lacerta</option>
                            <option>Leo</option>
                            <option>Leo Minor</option>
                            <option>Lepus</option>
                            <option>Libra</option>
                            <option>Lupus</option>
                            <option>Lynx</option>
                            <option>Lyra</option>
                            <option>Mensa</option>
                            <option>Microscopium</option>
                            <option>Monoceros</option>
                            <option>Musca</option>
                            <option>Norma</option>
                            <option>Octans</option>
                            <option>Ophiuchus</option>
                            <option>Orion</option>
                            <option>Pavo</option>
                            <option>Pegasus</option>
                            <option>Perseus</option>
                            <option>Phoenix</option>
                            <option>Pictor</option>
                            <option>Pisces</option>
                            <option>Piscis Austrinus</option>
                            <option>Puppis</option>
                            <option>Pyxis</option>
                            <option>Reticulum</option>
                            <option>Sagitta</option>
                            <option>Sagittarius</option>
                            <option>Scorpius</option>
                            <option>Sculptor</option>
                            <option>Scutum</option>
                            <option>Serpens</option>
                            <option>Sextans</option>
                            <option>Taurus</option>
                            <option>Telescopium</option>
                            <option>Triangulum</option>
                            <option>Triangulum Australe</option>
                            <option>Tucana</option>
                            <option>Ursa Major</option>
                            <option>Ursa Minor</option>
                            <option>Vela</option>
                            <option>Virgo</option>
                            <option>Volans</option>
                            <option>Vulpecula</option>

                        </Form.Control>
                    </Col>
                </Form.Group>

                <Col sm="2">
                    <input type="submit" value="Claim now!" disabled={!starName.value}/>
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



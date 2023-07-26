import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from "axios";
import { useContext, useState } from "react";
import { PersonalInformationContext } from "../../contexts/personalInfoContext";
import "./getuserdata.css";

const GetUserData = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [goal, setGoal] = useState("wl");
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [fat, setFat] = useState(0);
    const [age, setAge] = useState(0);
    const { setPersonalInformationContext } = useContext(PersonalInformationContext);

    const handleSubmit = async () => {
        setPersonalInformationContext({
            name,
            email,
            goal,
            weight,
            height,
            fat,
            age
        });

        try {
            const POST_DATA_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL || ""}${process.env.REACT_APP_POST_USER_DATA_ENDPOINT || ""}`;
            const response = await axios.post(POST_DATA_ENDPOINT, {
                name,
                email,
                goal,
                weight,
                height,
                fat,
                age
            });
            console.info("Recieved response from server as ", response);
        } catch (e) {
            console.warn("Error submitting data for processing", e);
        }
    }

    const handleGoalChange = async (event) => {
        setGoal(event.target.value);
        console.log(event.target.value);
    }

    return (
        <>
            {/* <div className="backdrop">
            </div> */}
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <Typography fontFamily={"unset"} variant="subtitle1" align="left" color="black" style={{ margin: "1em" }}>
                        Please answer the following questions
                    </Typography>
                    <TextField
                        label="Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        required
                        sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                        inputProps={{ style: { color: "black", } }}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                        sx={{ input: { color: "black", outlineColor: "white", marginBottom: "0.2em", fontFamily: "poppins" } }}
                    />
                    <FormControl fullWidth style={{ marginTop: "1em", marginBottom: "0.3em" }}>
                        <InputLabel id="fitness-goal-select">Fitness Goal</InputLabel>
                        <Select
                            labelId="fitness-goal-select"
                            id="fitness-goal-select-helper"
                            value={goal}
                            label="Fitness Goal"
                            onChange={handleGoalChange}
                            defaultValue="mg"

                            required
                            sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                        >
                            <MenuItem sx={{ fontFamily: "poppins" }} value={"mg"}>Muscle Gain</MenuItem>
                            <MenuItem sx={{ fontFamily: "poppins" }} value={"wl"}>Weight Loss</MenuItem>
                        </Select>
                    </FormControl>
                    <div className="sub-group">
                        <TextField
                            label="Weight (in lbs)"
                            fullWidth
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            margin="normal"
                            required
                            style={{ marginRight: "0.5em" }}
                            inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                            sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                        />
                        <TextField
                            label="Height (in cm)"
                            fullWidth
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            margin="normal"
                            required
                            inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                            sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                        />
                    </div>
                    <div className="sub-group">
                        <TextField
                            label="Age"
                            fullWidth
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            margin="normal"
                            required
                            style={{ marginRight: "0.5em" }}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                        />
                        <TextField
                            label="Body Fat %"
                            fullWidth
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                            margin="normal"
                            required
                            inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                            sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                        />
                    </div>

                    <Button variant="contained" className="submit-button">Submit</Button>
                </form>
            </div>
        </>
    );
}

export default GetUserData;
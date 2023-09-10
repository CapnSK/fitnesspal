import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from "axios";
import { useContext, useState } from "react";
import { PersonalInformationContext } from "../../contexts/personalInfoContext";
import "./getuserdata.css";
import { v4 as uuidv4 } from "uuid";

const GetUserData = ({ setRequestId }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [goal, setGoal] = useState("wl");
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [fat, setFat] = useState(0);
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState("M");
    const [lifestyle, setLifeStyle] = useState("ma");
    const { setPersonalInformationContext } = useContext(PersonalInformationContext);

    const handleSubmit = async () => {
        setPersonalInformationContext({
            name,
            email,
            goal,
            weight,
            height,
            fat,
            age,
            gender,
            lifestyle
        });
        try {
            const POST_DATA_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL || ""}${process.env.REACT_APP_POST_USER_DATA_ENDPOINT || ""}`;
            const id = uuidv4();
            const response = await axios.post(POST_DATA_ENDPOINT, {
                id,
                name,
                email,
                goal: goal === "wl" ? "weightLoss" : "weightGain",
                weight,
                height,
                fat,
                age,
                gender,
                lifestyle
            });
            setRequestId(id);
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
                <form>
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
                        style={{ marginRight: "0.5em" }}
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
                    <div className="sub-group">
                        <FormControl fullWidth style={{ marginTop: "1em", marginBottom: "0.3em", marginRight: "0.5em" }}>
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
                        <FormControl fullWidth style={{ marginTop: "1em", marginBottom: "0.3em", marginRight: "0.5em" }}>
                            <InputLabel id="lifestyle-select">Lifestyle</InputLabel>
                            <Select
                                labelId="lifestyle-select"
                                id="lifestyle-select-helper"
                                value={lifestyle}
                                label="Lifestyle"
                                onChange={(e) => setLifeStyle(e.target.value)}
                                defaultValue="ma"

                                required
                                sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                            >
                                <MenuItem sx={{ fontFamily: "poppins" }} value={"se"}>Sedentary</MenuItem>
                                <MenuItem sx={{ fontFamily: "poppins" }} value={"ma"}>Moderately Active</MenuItem>
                                <MenuItem sx={{ fontFamily: "poppins" }} value={"ra"}>Rigorously Active</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth style={{ marginTop: "1em", marginBottom: "0.3em" }}>
                            <InputLabel id="gender-select">Gender</InputLabel>
                            <Select
                                labelId="gender-select"
                                id="gender-select-helper"
                                value={gender}
                                label="Gender"
                                onChange={(e) => setGender(e.target.value)}
                                defaultValue="M"
                                required
                                sx={{ input: { color: "black", outlineColor: "white", fontFamily: "poppins" } }}
                            >
                                <MenuItem sx={{ fontFamily: "poppins" }} value={"M"}>M</MenuItem>
                                <MenuItem sx={{ fontFamily: "poppins" }} value={"F"}>F</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
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

                    <Button onClick={handleSubmit} variant="contained" className="submit-button">Submit</Button>
                </form>
            </div>
        </>
    );
}

export default GetUserData;
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useContext, useState, useEffect } from 'react';
import { PersonalInformationContext } from "../../contexts/personalInfoContext";
import Loader from "../Loader/loader";
import axios from "axios";
import "./showoutput.css";

const mockData = {
    macroDistribution: {
        P: 150,
        C: 300,
        Fa: 40,
        Fi: 25
    },
    TDEE: 2500,
    Intake: 2800
}


const ShowOutput = ({ requestId }) => {
    const [nutritionData, setNutritionData] = useState(undefined);
    const { email, name } = useContext(PersonalInformationContext);
    // requestId = "dummy";
    const [isLoading, setIsLoading] = useState(requestId && !nutritionData);


    const processData = (userData) => {
        console.log(userData);
        setNutritionData(userData);
        setIsLoading(false);
    }

    useEffect(() => {
        if(requestId){
            let stopPolling = false;
            setIsLoading(true);
            const FETCH_IMPORT_STATUS_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${process.env.REACT_APP_FETCH_IMPORT_STATUS_ENDPOINT}/${email}`;
            const FETCH_USER_DATA_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}/${email}`;
            const intervalId = setInterval(async () => {
                try{
                    let response = await axios.get(FETCH_IMPORT_STATUS_ENDPOINT);
                    if(response.status === 200 && response.data.status === "Done"){
                        console.info("The processing is complete", response.data);
                        response = await axios.get(FETCH_USER_DATA_ENDPOINT);
                        if(response.status === 200 && response.data.macros){
                            stopPolling = true;
                            processData(response.data);
                        }
                    }
                } catch(e){
                    console.debug("Error fetching data", e);
                }
                if(stopPolling){
                    clearInterval(intervalId);
                }
            }, 1000);
        }
    }, []);

    return (
        <div className="form">
            {!requestId && (
                <Typography className="no-data" fontFamily={"unset"} variant="subtitle1" align="left" color="black" style={{ margin: "1em", width: "80%" }}>
                    Please fill out the data to get information about your calorie intake and macro distribution
                </Typography>
            )}
            {requestId && !nutritionData && (
                <>
                    <Typography className="no-data" fontFamily={"unset"} variant="subtitle1" align="left" color="black" style={{ margin: "1em", width: "80%" }}>
                        Please wait till we figure out a right diet plan for you
                    </Typography>
                </>
            )}
            {(
                <>
                    {isLoading ? <div className="loader"><Loader /></div> : (nutritionData ? (
                        <>
                            <Typography fontFamily={"unset"} variant="h6" align="center" color="black">
                                TDEE: {nutritionData?.TDEE} (kCal)
                            </Typography>
                            <Typography fontFamily={"unset"} variant="h6" align="center" color={nutritionData?.TDEE > nutritionData?.Intake ? "red" : "green"}>
                                Intake: {nutritionData?.Intake} (kCal)
                            </Typography>

                            <TableContainer component={Paper} style={{ marginTop: "1em"}}>
                                <Table sx={{ minWidth: 350 }} aria-label="maro-table" style={{ filter: "blur('5px')" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Macro Type</TableCell>
                                            <TableCell align="center">Intake (in gms)</TableCell>
                                            <TableCell align="center">Calories</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Protien</TableCell>
                                            <TableCell align="center">{nutritionData.macroDistribution.P}</TableCell>
                                            <TableCell align="center">{nutritionData.macroDistribution.P * 4}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Carbs</TableCell>
                                            <TableCell align="center">{nutritionData.macroDistribution.C}</TableCell>
                                            <TableCell align="center">{nutritionData.macroDistribution.C * 4}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Fats</TableCell>
                                            <TableCell align="center">{nutritionData.macroDistribution.Fa}</TableCell>
                                            <TableCell align="center">{nutritionData.macroDistribution.Fa * 9}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Fibers</TableCell>
                                            <TableCell align="center">{nutritionData.macroDistribution.Fi}</TableCell>
                                            <TableCell align="center">-</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography fontFamily={"unset"} variant="subtitle2" align="left" color="coral" style={{marginTop: "2em"}}>
                                Remember {name || "buddy"} that the greatest battles are fought in the minds first! Hope that you stick to a strict regime and achieve the result that you want.
                            </Typography>
                        </>
                    ) : "")}
                </>
            )}
        </div>
    );
}

export default ShowOutput;
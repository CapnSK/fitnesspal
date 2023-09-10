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
            const FETCH_USER_DATA_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}/${process.env.REACT_APP_GET_USER_DATA_ENDPOINT}/${email}`;
            const intervalId = setInterval(async () => {
                try{
                    let response = await axios.get(FETCH_IMPORT_STATUS_ENDPOINT);
                    if(response.status === 200 && response.data.status === "Done"){
                        console.info("The processing is complete", response.data);
                        response = await axios.get(FETCH_USER_DATA_ENDPOINT);
                        if(response.status === 200 && response.data.macroDistribution){
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
    }, [requestId]);

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
                                            <TableCell style={{fontWeight: "bold" , fontFamily:"unset"}}>Macro Type</TableCell>
                                            <TableCell style={{fontWeight: "bold" , fontFamily:"unset"}} align="center">Intake (in gms)</TableCell>
                                            <TableCell style={{fontWeight: "bold" , fontFamily:"unset"}} align="center">Calories</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{fontFamily:"unset"}}>
                                        <TableRow>
                                            <TableCell style={{fontFamily:"unset"}}>Protein</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">{nutritionData.macroDistribution.P}</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">{nutritionData.macroDistribution.P * 4}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{fontFamily:"unset"}}>Carbs</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">{nutritionData.macroDistribution.C}</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">{nutritionData.macroDistribution.C * 4}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{fontFamily:"unset"}}>Fats</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">{nutritionData.macroDistribution.Fa}</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">{nutritionData.macroDistribution.Fa * 9}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{fontFamily:"unset"}}>Fibers</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">{nutritionData.macroDistribution.Fi}</TableCell>
                                            <TableCell style={{fontFamily:"unset"}} align="center">-</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography fontFamily={"unset"} variant="subtitle2" align="left" color="coral" style={{marginTop: "2em", padding: "0.2em", "backgroundColor": "rgba(0,0,0,0.4)"}}>
                                Remember {name || "buddy"}, the greatest battles are won in the mind first! Hope that you stick to a strict regime and achieve the result that you want.
                            </Typography>
                        </>
                    ) : "")}
                </>
            )}
        </div>
    );
}

export default ShowOutput;
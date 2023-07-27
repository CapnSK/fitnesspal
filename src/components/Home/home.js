import "./home.css";
import GetUserData from "../GetUserData/getuserdata";
import ShowOutput from "../ShowOutput/showoutput";
import { useState } from "react";

const Home = () =>{
    const [requestId, setRequestId] = useState(""); //stores the id of the request
    return (
        <>
            <div className="user-data-section">
                <GetUserData setRequestId={setRequestId}/>
            </div>
            <div className="show-result-section">
                <ShowOutput requestId={requestId}/>
            </div>
        </>
    );
}

export default Home;
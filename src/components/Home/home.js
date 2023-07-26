import "./home.css";
import GetUserData from "../GetUserData/getuserdata";
import ShowOutput from "../ShowOutput/showoutput";

const Home = () =>{
    return (
        <>
            <div className="user-data-section">
                <GetUserData/>
            </div>
            <div className="show-result-section">
                <ShowOutput/>
            </div>
        </>
    );
}

export default Home;
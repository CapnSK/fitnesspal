import './App.css';
import Routes from './Routes';
import { PersonalInformationContextProvider } from "./contexts/personalInfoContext";


function App() {
  return (
    <PersonalInformationContextProvider>
      <div className="App">
        <Routes />
      </div>
    </PersonalInformationContextProvider>
  );
}

export default App;

import { CircularProgress, Typography } from '@mui/material';
import './loader.css';

function Loader() {

  return (
    <div className="root">
      <CircularProgress />
      <Typography
        variant="subtitle1"
        component="h2"
        className="loading-text"
      >
        Loading...
      </Typography>
    </div>
  );
}

export default Loader;
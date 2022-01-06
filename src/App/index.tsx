import React, {useEffect, useState} from 'react';
import {AppBar, CircularProgress, Toolbar, Typography} from '@mui/material';
import {getPlaces} from '../api';
import PlacesList from '../PlacesList';
import {Place} from '../types';

import {ThemeProvider} from '@mui/material/styles';
import themeTemplate from '../theme';

function App() {
  return (
    <ThemeProvider theme={themeTemplate}>
      <Menu />
      <MainComponent />
    </ThemeProvider>
  );
}

function Menu() {
  return (
    <nav>
      <AppBar position="fixed" component="div">
        <Toolbar>
          <Typography variant="h5" component="h1">
            Find a COVID Test
          </Typography>
        </Toolbar>
      </AppBar>
      {/* workaround for spacing - see https://material-ui.com/components/app-bar/#fixed-placement */}
      <Toolbar />
    </nav>
  );
}

function MainComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    getPlaces().then(retrievedPlaces => {
      setPlaces(retrievedPlaces);
      setIsLoading(false);
    });
    return;
  }, []);
  return (
    <div>{isLoading ? <CircularProgress /> : <PlacesList {...{places}} />}</div>
  );
}

export default App;

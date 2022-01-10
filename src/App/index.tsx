import React, {useEffect, useState} from 'react';
import {
  AppBar,
  CircularProgress,
  Fab,
  Toolbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {getPlaces} from '../api';
import AddReport from '../AddReport';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPlace, setDialogPlace] = useState<Place | undefined>();
  const [userLocation, setUserLocation] =
    useState<{lat: number; long: number}>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geo => {
      setUserLocation({lat: geo.coords.latitude, long: geo.coords.longitude});
      setIsLoading(false);
      setPlaces([]);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getPlaces().then(retrievedPlaces => {
      setPlaces(retrievedPlaces);
      setIsLoading(false);
    });
    return;
  }, [userLocation]);

  useEffect(() => {
    if (!dialogOpen) {
      setDialogPlace(undefined);
    }
  }, [dialogOpen]);

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : userLocation && userLocation?.lat && userLocation?.long ? (
        <>
          <Fab
            onClick={() => setDialogOpen(true)}
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
            }}
          >
            <AddIcon />
          </Fab>
          <AddReport
            place={dialogPlace}
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          />
          <PlacesList {...{places}} />
          <Typography variant="caption">
            Content displayed is sourced by the community and not vetted by Ora
            Innovations, LLC. The information shown may be outdated or incorrect
            and is not sanctioned by any government entity.
          </Typography>
        </>
      ) : (
        <Typography>Please set your location.</Typography>
      )}
    </div>
  );
}

export default App;

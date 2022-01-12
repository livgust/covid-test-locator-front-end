import React, {createContext, useEffect, useState} from 'react';
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

// location prop is for testing only.
function App(props: {location?: {latitude: number; longitude: number}}) {
  return (
    <ThemeProvider theme={themeTemplate}>
      <Menu />
      <MainComponent location={props.location} />
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

type userLocationType = {latitude: number; longitude: number} | undefined;

export const LocationContext = createContext<userLocationType>(undefined);

// location prop is for testing only.
function MainComponent(props: {
  location?: {latitude: number; longitude: number};
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPlace, setDialogPlace] = useState<Place | undefined>();
  const [userLocation, setUserLocation] = useState<userLocationType>(
    props.location
  );

  useEffect(() => {
    if (!props.location?.latitude || !props.location?.longitude) {
      navigator.geolocation.getCurrentPosition(geo => {
        const {latitude, longitude} = geo.coords;
        console.log('USER LOCATION IS....');
        console.log({latitude, longitude});
        setUserLocation({latitude, longitude});
        setIsLoading(false);
        setPlaces([]);
      });
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (userLocation) {
      getPlaces(userLocation).then(retrievedPlaces => {
        setPlaces(retrievedPlaces);
        setIsLoading(false);
      });
    } else {
      console.log('NO USER LOCATION SET');
      setIsLoading(false);
    }
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
      ) : userLocation && userLocation?.latitude && userLocation?.longitude ? (
        <LocationContext.Provider value={userLocation}>
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
        </LocationContext.Provider>
      ) : (
        <Typography>
          Please set your location. If you do not see a prompt for this page to
          get your location,{' '}
          <a
            href="https://www.lifewire.com/denying-access-to-your-location-4027789"
            target="_blank"
            rel="noreferrer"
          >
            click here for instructions
          </a>
          .
        </Typography>
      )}
    </div>
  );
}

export default App;

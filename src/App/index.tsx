import React, {createContext, useEffect, useState} from 'react';
import {
  Alert,
  AppBar,
  Box,
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
import MenuButton from './Menu';

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
          <Box sx={{display: 'flex', width: '100%', alignItems: 'center'}}>
            <Typography variant="h5" component="h1" sx={{flexGrow: 1}}>
              Covid Test Collaborative
            </Typography>
            <MenuButton />
          </Box>
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
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Alert severity="info">
            CovidTestCollab.com hosts a crowd-sourced list of at-home COVID
            rapid tests available for purchase in-store. If you know that a
            store near you does or does not have tests available, please add a
            report by clicking the + icon below.
          </Alert>
          {userLocation && userLocation?.latitude && userLocation?.longitude ? (
            <LocationContext.Provider value={userLocation}>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  pt: 2,
                }}
              >
                <Fab
                  variant="extended"
                  onClick={() => setDialogOpen(true)}
                  color="primary"
                  aria-label="add"
                >
                  <AddIcon />
                  Add Report
                </Fab>
              </Box>
              <AddReport
                place={dialogPlace}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
              />
              <PlacesList {...{places}} />
              <Typography variant="caption">
                Content displayed is sourced by the community and not vetted by
                Ora Innovations, LLC. The information shown may be outdated or
                incorrect. This website is not affiliated with any government
                entity.
              </Typography>
            </LocationContext.Provider>
          ) : (
            <Alert severity="error">
              Please set your location. If you do not see a prompt for this page
              to get your location,{' '}
              <a
                href="https://www.lifewire.com/denying-access-to-your-location-4027789"
                target="_blank"
                rel="noreferrer"
              >
                click here for instructions
              </a>
              .
            </Alert>
          )}
        </>
      )}
    </div>
  );
}

export default App;

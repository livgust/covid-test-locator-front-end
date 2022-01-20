import React, {createContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import AddIcon from '@mui/icons-material/Add';
import {getPlaces} from '../api';
import AddReport from '../AddReport';
import PlacesList from '../PlacesList';
import {Place} from '../types';
import MenuButton from './Menu';
import Location from './Location';
import {userLocationType} from '../locationUtils';

import {ThemeProvider} from '@mui/material/styles';
import themeTemplate from '../theme';

// location prop is for testing only.
function App() {
  return (
    <ThemeProvider theme={themeTemplate}>
      <CssBaseline>
        <Menu />
        <MainComponent />
      </CssBaseline>
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

export const LocationContext = createContext<userLocationType | undefined>(
  undefined
);

// location prop is for testing only.
function MainComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPlace, setDialogPlace] = useState<Place | undefined>();
  const [userLocation, setUserLocation] = useState<
    userLocationType | undefined
  >();

  const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const previousUserLocation = usePrevious(userLocation);

  /** If the location updates, trigger a search. */
  useEffect(() => {
    if (JSON.stringify(userLocation) !== JSON.stringify(previousUserLocation)) {
      setIsLoading(true);
      if (userLocation) {
        getPlaces(userLocation).then(retrievedPlaces => {
          setPlaces(retrievedPlaces);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    } else {
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
    <Box sx={{p: 1}}>
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
          <Paper sx={{p: 2}}>
            <Typography variant="h5" component="h1">
              Are COVID at-home tests available near you?
            </Typography>
            <Typography>
              <b>Get information:</b> Find out where to get tests near you.
              <br />
              <b>Give information:</b> Update our records if you find stores
              that have tests or stores that have sold out.
            </Typography>
          </Paper>
          {(!userLocation ||
            !userLocation?.latitude ||
            !userLocation?.longitude) && (
            <Alert severity="error" sx={{mt: 2}}>
              Please set your location below to find stores with tests.{' '}
            </Alert>
          )}
          <LocationContext.Provider value={userLocation}>
            <form>
              <Grid
                columnSpacing={{xs: 5, sm: 15, md: 30}}
                rowSpacing={1}
                container
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  pt: 2,
                  alignItems: 'center',
                }}
              >
                <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                  <Location
                    onUserLocationSet={loc => {
                      setUserLocation(loc);
                      setIsLoading(false);
                    }}
                  />
                </Grid>
                <Grid item>
                  <Fab
                    variant="extended"
                    onClick={() => setDialogOpen(true)}
                    color="primary"
                    aria-label="add"
                    disabled={
                      !userLocation ||
                      !userLocation.latitude ||
                      !userLocation.longitude
                    }
                  >
                    <AddIcon />
                    Add Report
                  </Fab>
                </Grid>
              </Grid>
            </form>
            <AddReport
              place={dialogPlace}
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
            />
            <PlacesList {...{places}} />
          </LocationContext.Provider>
          <Box sx={{mt: 2}}>
            <Typography variant="caption">
              Content displayed is sourced by the community and not vetted by
              Ora Innovations, LLC. The information shown may be outdated or
              incorrect. This website is not affiliated with any government
              entity.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;

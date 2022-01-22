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
import {getPlaces} from '../api';
import {Place} from '../types';
import {userLocationType} from '../locationUtils';
import AddIcon from '@mui/icons-material/Add';
import AddReport from '../AddReport';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Location from './Location';
import MenuButton from './Menu';
import PlacesList from '../PlacesList';
import Switch from '@mui/material/Switch';

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
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [userLocation, setUserLocation] = useState<
    userLocationType | undefined
  >();

  const filteredPlaces = showAvailableOnly
    ? places.filter(place => {
        const newestReport = place!.reports!.sort((repA, repB) =>
          repA.created! > repB.created! ? -1 : 1
        )?.[0];
        return newestReport?.available;
      })
    : places;

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
      if (userLocation) {
        setIsLoading(true);
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
      <>
        <Paper sx={{p: 2}}>
          <Typography variant="h5" component="h1">
            Are COVID at-home tests available near you?
          </Typography>
          <Typography>
            <b>Get information:</b> Find out where to get tests near you.
            <br />
            <b>Give information:</b> Update our records if you find stores that
            have tests or stores that have sold out.
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
              <Grid container>
                <Grid item xs={0} sm={2} md={3} />
                <Grid item xs={12} sm={8} md={6} sx={{m: 2}}>
                  <Typography>
                    Showing stores within 50 miles.
                    <br />
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showAvailableOnly}
                        onChange={event =>
                          setShowAvailableOnly(event.target.checked)
                        }
                      />
                    }
                    label="Only show stores with tests"
                  />
                  <br />
                  <br />
                  <PlacesList {...{places: filteredPlaces}} />
                </Grid>
                <Grid item xs={0} sm={2} md={3} />
              </Grid>
            </>
          )}
        </LocationContext.Provider>
      </>
      <Box sx={{mt: 2}}>
        <Typography variant="caption">
          Content displayed is sourced by the community and not vetted by Ora
          Innovations, LLC. The information shown may be outdated or incorrect.
          This website is not affiliated with any government entity.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;

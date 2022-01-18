import React, {createContext, useEffect, useState} from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {getPlaces, geocode, reverseGeocode} from '../api';
import AddReport from '../AddReport';
import PlacesList from '../PlacesList';
import {Place} from '../types';
import MenuButton from './Menu';

import {ThemeProvider} from '@mui/material/styles';
import themeTemplate from '../theme';
import {MyLocation} from '@mui/icons-material';

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
  const [userLocationString, setUserLocationString] = useState<
    string | undefined
  >();

  /** Gets location from browser and then puts a pretty string in the text box. */
  const getAndSetLocation = () => {
    navigator.geolocation.getCurrentPosition(geo => {
      const {latitude, longitude} = geo.coords;
      reverseGeocode({latitude, longitude}).then(setUserLocationString);
      setLocation(latitude, longitude);
    });
  };

  /** Sets the user location, triggering a search */
  const setLocation = (latitude: number, longitude: number) => {
    setUserLocation({latitude, longitude});
    setIsLoading(false);
    setPlaces([]);
  };

  /** If we have browser permission already, grabs location on page load */
  useEffect(() => {
    if (
      (!props.location?.latitude || !props.location?.longitude) &&
      navigator.permissions // some mobile browsers don't have navigator.permissions at all
    ) {
      // if we're already allowed to get the user's location, do it.
      navigator.permissions
        .query({name: 'geolocation'})
        .then((status: PermissionStatus) => {
          if (status.state === 'granted') {
            getAndSetLocation();
          }
        });
    }
    return;
  }, []);

  /** If the location updates, trigger a search. */
  useEffect(() => {
    setIsLoading(true);
    if (userLocation) {
      getPlaces(userLocation).then(retrievedPlaces => {
        setPlaces(retrievedPlaces);
        setIsLoading(false);
      });
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
          {(!userLocation ||
            !userLocation?.latitude ||
            !userLocation?.longitude) && (
            <Alert severity="error" sx={{mt: 2}}>
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
                <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                  <TextField
                    sx={{pr: 1}}
                    label="My location"
                    value={userLocationString}
                    onChange={event =>
                      setUserLocationString(event.target.value)
                    }
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          onClick={() => {
                            getAndSetLocation();
                          }}
                          sx={{cursor: 'pointer'}}
                          position="end"
                        >
                          <MyLocation />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!userLocationString}
                    onClick={event => {
                      event.preventDefault();
                      geocode(userLocationString!)
                        .then(({latitude, longitude, formattedAddress}) => {
                          setLocation(latitude, longitude);
                          setUserLocationString(formattedAddress);
                        })
                        .catch(() => {
                          console.error(
                            `unable to reverse geocode ${userLocationString}`
                          );
                        });
                    }}
                  >
                    Set
                  </Button>
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
          <Typography variant="caption">
            Content displayed is sourced by the community and not vetted by Ora
            Innovations, LLC. The information shown may be outdated or
            incorrect. This website is not affiliated with any government
            entity.
          </Typography>
        </>
      )}
    </div>
  );
}

export default App;

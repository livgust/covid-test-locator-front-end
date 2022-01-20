import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MyLocation from '@mui/icons-material/MyLocation';
import TextField from '@mui/material/TextField';
import {geocode, reverseGeocode} from '../api';
import {
  userLocationType,
  canGetBrowserLocation,
  getBrowserLocation,
} from '../locationUtils';

export default function Location({
  onUserLocationSet,
}: {
  onUserLocationSet: (loc: userLocationType | undefined) => void;
}) {
  const [userLocationString, setUserLocationString] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  /** Gets location from browser and then puts a pretty string in the text box. */
  const getAndSetLocation = async () => {
    let location = null;
    try {
      location = await getBrowserLocation();
    } catch (e) {
      location = null;
    }
    if (!location) {
      setErrorMessage('Unable to retrieve your location.');
      setUserLocationString('');
    } else {
      setErrorMessage('');
      reverseGeocode(location).then(setUserLocationString);
      setLocation(location);
    }
  };

  /** Sets the user location, triggering a search */
  const setLocation = (location: userLocationType | undefined) => {
    onUserLocationSet(location);
  };

  /** If we have browser permission already, grabs location on page load */
  useEffect(() => {
    canGetBrowserLocation().then(allowed => {
      if (allowed) {
        getAndSetLocation();
      } else {
        setLocation(undefined);
      }
      return;
    });
  }, []);

  return (
    <>
      <TextField
        sx={{pr: 1}}
        label="My location"
        value={userLocationString}
        onChange={event => setUserLocationString(event.target.value)}
        autoFocus
        error={!!errorMessage}
        helperText={errorMessage}
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
              if (!formattedAddress) {
                throw new EvalError('no address returned');
              } else {
                setErrorMessage('');
                setLocation({latitude, longitude});
                setUserLocationString(formattedAddress);
              }
            })
            .catch(() => {
              console.error(`unable to reverse geocode ${userLocationString}`);
              setUserLocationString('');
              setErrorMessage('Invalid location.');
            });
        }}
      >
        Set
      </Button>
    </>
  );
}

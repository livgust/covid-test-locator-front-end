import React, {useContext, useState} from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import {addPlace, searchPlaces} from '../api';
import {Place} from '../types';
import {LocationContext} from '../App';

/**
 * @param props Takes onPlaceSelect which returns the Place that is selected
 *   when it is chosen.
 * @returns React Component that allows you to search for a location and
 *   requests that the server add the location.
 */
function LocationSearch(props: {onPlaceSelect?: (place: Place) => any}) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Place[]>([]);
  const {latitude, longitude} = useContext(LocationContext)!;
  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <TextField
          label="Search for location"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          sx={{flexGrow: 1}}
        />
        <Button
          disabled={!searchTerm.trim()}
          onClick={() => {
            searchPlaces({
              latitude,
              longitude,
              keyword: searchTerm.trim(),
            }).then(setResults);
          }}
          sx={{ml: '5px'}}
        >
          Search
        </Button>
      </Box>
      <List>
        {results.map(place => (
          <div key={place.googlePlaceId}>
            <ListItem>
              <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <Box sx={{flexGrow: 1}}>
                  <ListItemText>
                    <Typography>{place.name}</Typography>
                    <Typography>{place.vicinity}</Typography>
                  </ListItemText>
                </Box>
                <Box>
                  <Button
                    color="secondary"
                    onClick={() => {
                      if (!place.id) {
                        addPlace(place); // async function - we don't wait for it to resolve
                      }
                      if (props.onPlaceSelect) {
                        props.onPlaceSelect(place);
                      }
                    }}
                  >
                    Select
                  </Button>
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </>
  );
}

export default LocationSearch;

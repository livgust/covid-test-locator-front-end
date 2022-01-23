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
import {searchPlaces} from '../api';
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
  const [results, setResults] = useState<Place[] | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const {latitude, longitude} = useContext(LocationContext)!;
  return (
    <>
      <form>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <TextField
            label="Search for location"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            sx={{flexGrow: 1}}
            autoFocus
          />
          <Button
            type="submit"
            disabled={!searchTerm.trim() || isSearching}
            onClick={event => {
              event.preventDefault();
              setIsSearching(true);
              searchPlaces({
                latitude,
                longitude,
                keyword: searchTerm.trim(),
              }).then(results => {
                setResults(results);
                setIsSearching(false);
              });
            }}
            sx={{ml: '5px'}}
          >
            Search
          </Button>
        </Box>
      </form>
      {isSearching && <Typography>Searching . . .</Typography>}
      {results && !results.length && !isSearching ? (
        <Box sx={{pt: 2}}>
          <Typography>
            No results found. Please try a different search, such as "CVS
            Cambridge MA."
          </Typography>
        </Box>
      ) : (
        <List>
          {(results || []).map(place => (
            <div key={place.googlePlaceId}>
              <ListItem>
                <Box
                  sx={{display: 'flex', alignItems: 'center', width: '100%'}}
                >
                  <Box sx={{flexGrow: 1}}>
                    <ListItemText>
                      <Typography variant="h5" component="div">
                        {place.name}
                      </Typography>
                      <Typography variant="subtitle1" component="div">
                        {place.vicinity}
                      </Typography>
                    </ListItemText>
                  </Box>
                  <Box>
                    <Button
                      color="secondary"
                      onClick={async () => {
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
      )}
    </>
  );
}

export default LocationSearch;

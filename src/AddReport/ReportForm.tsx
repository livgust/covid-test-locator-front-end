import React, {useEffect, useState} from 'react';
import {Place, Report} from '../types';
import {addReport, addPlace} from '../api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DateAdapter from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';

/**
 * @param props Place to report for, plus onSubmission to call when a user hits
 *   submit, containing the promise for server-side submission
 * @returns React component that submits a report for a Place
 */
function ReportForm(props: {
  place: Place;
  onSubmission?: (promise: Promise<void>) => any;
  onBack: () => any;
}) {
  const [testsAvailableRadio, setTestsAvailableRadio] = useState<string>('');
  const [limitNumber, setLimitNumber] = useState<string>('');
  const [created, setCreated] = useState<Date | null | undefined>();
  useEffect(() => {
    if (testsAvailableRadio === 'No tests available') {
      setLimitNumber('');
    }
  }, [testsAvailableRadio]);

  const submitForm = async () => {
    const getPlacePromise = new Promise<number>(resolve => {
      if (props.place.id) {
        resolve(props.place.id);
      } else {
        addPlace(props.place).then(place => resolve(place.id!));
      }
    });
    const returnPromise = getPlacePromise
      .then(placeId =>
        addReport({
          placeId,
          available: testsAvailableRadio === 'Tests available',
          type: 'at-home rapid antigen test',
          limit: parseInt(limitNumber),
          created,
        } as Report)
      )
      .then(() => {});
    if (props.onSubmission) {
      props.onSubmission(returnPromise);
    }
    return;
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <form>
        <Typography variant="h5" component="h2">
          Add report for {props.place.name}
        </Typography>
        <Typography variant="subtitle1">{props.place.vicinity}</Typography>
        <br />
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <FormControl required sx={{pb: 2}}>
            <FormLabel component="legend">Test availability</FormLabel>
            <RadioGroup
              aria-label="test-availability"
              name="test-availability"
              value={testsAvailableRadio}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setTestsAvailableRadio((event.target as HTMLInputElement).value)
              }
            >
              <FormControlLabel
                control={<Radio />}
                label="Tests available"
                value="Tests available"
              />
              <FormControlLabel
                control={<Radio />}
                label="No tests available"
                value="No tests available"
              />
              <DateTimePicker
                label="Date and time of report"
                value={created}
                onChange={setCreated}
                maxDate={new Date()}
                renderInput={(params: TextFieldProps) => (
                  <TextField {...params} />
                )}
              />
            </RadioGroup>
          </FormControl>
          <TextField
            type="number"
            value={limitNumber}
            onChange={event => setLimitNumber(event.target.value)}
            label="Limit per customer"
            disabled={testsAvailableRadio === 'No tests available'}
          />
        </Box>
        <DialogActions>
          <Button
            type="submit"
            disabled={!formIsValid(testsAvailableRadio)}
            onClick={event => {
              event.preventDefault();
              submitForm();
            }}
          >
            Submit
          </Button>
          <Button color="secondary" onClick={props.onBack}>
            Back
          </Button>
        </DialogActions>
      </form>
    </LocalizationProvider>
  );
}

export function formIsValid(testsAvailableRadio: undefined | string): boolean {
  return !!testsAvailableRadio;
}

export default ReportForm;

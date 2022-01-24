import React, {useState} from 'react';
import {Place} from '../types';
import {formatDistanceToNow} from 'date-fns';
import AddReport from '../AddReport';
import Button from '@mui/material/Button';
import Cancel from '@mui/icons-material/Cancel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import ValidateReport from './ValidateReport';

function PlacesList(props: {places: Place[]}) {
  return (
    <>
      {props.places.length ? (
        props.places.map(place => <PlaceItem place={place} key={place.id} />)
      ) : (
        <Typography>No results.</Typography>
      )}
    </>
  );
}

function PlaceItem(props: {place: Place}) {
  const place = props.place;

  const [validatedByUser, setValidatedByUser] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);

  const newestReport = place!.reports!.sort((repA, repB) =>
    repA.created! > repB.created! ? -1 : 1
  )?.[0];
  const newestValidation = (newestReport?.validations || []).sort(
    (valA, valB) => (valA.created! > valB.created! ? -1 : 1)
  )?.[0];
  const availabilityText =
    newestReport?.available && newestReport.limit ? (
      <>
        <CheckCircle />
        &nbsp;Tests&nbsp;<b>are</b>&nbsp;available - limit {newestReport.limit}{' '}
        per customer
      </>
    ) : newestReport?.available ? (
      <>
        <CheckCircle />
        <span>
          Tests <b>are</b> available
        </span>
      </>
    ) : (
      <>
        <Cancel />
        <span>
          Tests are <b>not</b> available
        </span>
      </>
    );
  const availabilityHtml = newestReport ? (
    <Typography
      sx={{
        color: newestReport.available ? 'success.main' : 'text.secondary',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {availabilityText}
    </Typography>
  ) : (
    <Typography sx={{color: 'text.disabled'}}>
      Test availability unknown
    </Typography>
  );
  const validationCopy = validatedByUser
    ? '; last confirmed just now'
    : newestValidation
    ? `; last confirmed ${formatDistanceToNow(
        new Date(newestValidation.created!)
      )} ago`
    : '';
  const reportedCopy = newestReport?.created && (
    <Typography variant="subtitle2">{`Reported ${formatDistanceToNow(
      new Date(newestReport.created)
    )} ago${validationCopy}`}</Typography>
  );

  const validationCount =
    (newestReport?.validations?.length || 0) + (validatedByUser ? 1 : 0);

  // for pluralizing copy
  const addS = validationCount > 1 ? 's' : '';

  return (
    <>
      <Card sx={{mt: 2, mb: 2}}>
        <CardContent>
          <Typography variant="h4" component="h1">
            {place.name}
          </Typography>
          <Typography variant="subtitle1">
            {place.vicinity}{' '}
            {place.distance &&
              `(${Math.round(place.distance * 10) / 10} miles)`}
          </Typography>
          {place.phoneNumber && (
            <Typography variant="subtitle1">{place.phoneNumber}</Typography>
          )}
          {availabilityHtml}
          {reportedCopy}
          {newestReport && (
            <Typography variant="subtitle2">
              {validationCount
                ? `${validationCount} user${addS} ${
                    addS ? 'have' : 'has'
                  } confirmed this report so far.`
                : 'No other users have confirmed this report yet.'}
            </Typography>
          )}
          <br />
          {newestReport && (
            <ValidateReport
              report={newestReport}
              afterValidate={() => {
                setValidatedByUser(true);
              }}
            />
          )}
          <Button color="secondary" onClick={() => setShowAddReport(true)}>
            {newestReport?.available
              ? 'I did not find tests here'
              : 'I found tests here'}
          </Button>
        </CardContent>
      </Card>
      <AddReport
        open={showAddReport}
        onClose={() => setShowAddReport(false)}
        place={props.place}
      />
    </>
  );
}

export default PlacesList;

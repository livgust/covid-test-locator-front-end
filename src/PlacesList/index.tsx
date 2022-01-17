import Typography from '@mui/material/Typography';
import React, {useState} from 'react';
import {Place} from '../types';
import {formatDistanceToNow} from 'date-fns';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ValidateReport from './ValidateReport';
import Button from '@mui/material/Button';
import AddReport from '../AddReport';

function PlacesList(props: {places: Place[]}) {
  const sideColumn = <Grid item xs={0} sm={2} md={3} />;
  return (
    <Grid container>
      {sideColumn}
      <Grid item xs={12} sm={8} md={6}>
        {props.places.map(place => (
          <PlaceItem place={place} key={place.id} />
        ))}
      </Grid>
      {sideColumn}
    </Grid>
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
    newestReport?.available && newestReport.limit
      ? `Tests available - limit ${newestReport.limit} per customer`
      : newestReport?.available
      ? 'Tests available'
      : 'Tests not available';
  const availabilityHtml = newestReport ? (
    <Typography
      sx={{color: newestReport.available ? 'success.main' : 'text.secondary'}}
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
      <Card sx={{margin: 2}}>
        <CardContent>
          <Typography variant="h4" component="h1">
            {place.name}
          </Typography>
          <Typography variant="subtitle1">{place.vicinity}</Typography>
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
            This isn't right
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

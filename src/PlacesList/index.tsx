import Typography from '@mui/material/Typography';
import React, {useState} from 'react';
import {Place} from '../types';
import {formatDistanceToNow} from 'date-fns';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ValidateReport from './ValidateReport';

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

  const [extraValidationCount, setExtraValidationCount] = useState(0);

  const newestReport = place.reports.sort((a, b) =>
    a.created < b.created ? -1 : 1
  )?.[0];
  const availabilityText = newestReport
    ? newestReport.available
      ? 'Tests available'
      : 'Tests not available'
    : 'Test availability unknown';
  const reportedCopy = newestReport?.created && (
    <Typography>{`Reported ${formatDistanceToNow(
      new Date(newestReport.created)
    )} ago`}</Typography>
  );

  const validationCount =
    (newestReport?.validationCount || 0) + extraValidationCount;

  return (
    <Card sx={{margin: 2}}>
      <CardContent>
        <Typography variant="h4" component="h1">
          {place.name}
        </Typography>
        <Typography variant="subtitle1">{place.vicinity}</Typography>
        <Typography>{availabilityText}</Typography>
        {reportedCopy}
        {newestReport && (
          <Typography variant="subtitle2">
            {validationCount
              ? `${validationCount} validation(s)`
              : 'No validations yet'}
          </Typography>
        )}
        {newestReport && (
          <ValidateReport
            reportId={newestReport.id}
            afterValidate={() => {
              setExtraValidationCount(1);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default PlacesList;

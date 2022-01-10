import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle, Snackbar} from '@mui/material';
import LocationSearch from './LocationSearch';
import ReportForm from './ReportForm';
import {Place} from '../types';

/**
 * @param props Place if you don't need to search for one
 * @returns React component that optionally allows the user to search for a
 *   place, and handles saving the place and the resulting report.
 */
function AddReport(props: {place?: Place; open: boolean; onClose: () => any}) {
  const [place, setPlace] = useState(props.place);
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <Dialog onClose={props.onClose} open={props.open}>
        <DialogTitle>Add New Report</DialogTitle>
        <DialogContent>
          {!place ? (
            <LocationSearch onPlaceSelect={setPlace} />
          ) : (
            <ReportForm
              place={place}
              onBack={() => {
                if (props.place) {
                  props.onClose();
                } else {
                  setPlace(undefined);
                }
              }}
              onSubmission={promise => {
                props.onClose();
                promise.then(() => setShowToast(true));
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={showToast}
        autoHideDuration={6000}
        onClose={() => setShowToast(false)}
        message="Report added"
      />
    </>
  );
}

export default AddReport;

import React, {useState} from 'react';
import {Button} from '@mui/material';
import {verifyReport} from '../api';
import {Report} from '../types';

function ValidateReport(props: {report: Report; afterValidate?: () => any}) {
  const [hasValidated, setHasValidated] = useState(false);
  return (
    <Button
      disabled={hasValidated}
      onClick={() => {
        // assumes this will always work;
        // shows success behavior immediately
        // and doesn't verify the response
        verifyReport(props.report);
        setHasValidated(true);
        props.afterValidate?.();
      }}
      sx={{mr: 2}}
    >
      {hasValidated ? 'Report confirmed' : 'This is right'}
    </Button>
  );
}

export default ValidateReport;

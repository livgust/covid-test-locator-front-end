import React, {useState} from 'react';
import {Button} from '@mui/material';
import {verifyReport} from '../api';

function ValidateReport(props: {reportId: number; afterValidate?: () => any}) {
  const [hasValidated, setHasValidated] = useState(false);
  return (
    <Button
      disabled={hasValidated}
      onClick={() => {
        // assumes this will always work;
        // shows success behavior immediately
        // and doesn't verify the response
        verifyReport(props.reportId);
        setHasValidated(true);
        props.afterValidate?.();
      }}
      sx={{mr: 2}}
    >
      {hasValidated ? 'Validated' : 'Validate Report'}
    </Button>
  );
}

export default ValidateReport;

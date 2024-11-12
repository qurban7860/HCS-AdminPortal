// import React from 'react';
// import PropTypes from 'prop-types';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider, Chip, Typography } from '@mui/material';

// function ViewFormField({ sm, heading, param, children }) {
//   return (
//     <Grid item sm={sm} xs={12}>
//       <Typography variant="subtitle2" color="textSecondary">
//         {heading}
//       </Typography>
//       {children || (
//         <Typography variant="body2">
//           {param || ''}
//         </Typography>
//       )}
//     </Grid>
//   );
// }

// ViewFormField.propTypes = {
//   sm: PropTypes.number,
//   heading: PropTypes.string.isRequired,
//   param: PropTypes.string,
//   children: PropTypes.node,
// };
// function ApiLogsViewForm({ open, onClose, logDetails, requestMethodColor='default', responseStatusColor='default' }) {
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md"  aria-labelledby="api-log-dialog-title" aria-describedby="api-log-dialog-description" fullWidth>
//       <DialogTitle variant="h3" sx={{ pb: 1, pt: 2 }}>API Log Details</DialogTitle>
//       <Divider orientation="horizontal" flexItem />
//       <DialogContent dividers sx={{ px: 3, pt: 2 }}>
//         <Grid container spacing={2}>
//           <ViewFormField sm={6} heading="Created At" param={logDetails?.createdAt || ''} />
//           <ViewFormField item sm={6}  heading="Request Method">
//             <Chip label={logDetails?.requestMethod || ''} color={requestMethodColor} size="small" />
//           </ViewFormField>
//           <ViewFormField sm={6} heading="Request URL" param={logDetails?.requestURL || ''} />
//           <ViewFormField sm={6} heading="Response Status Code">
//             <Chip label={logDetails?.responseStatusCode || ''} color={responseStatusColor} size="small" />
//           </ViewFormField>
//           <ViewFormField sm={6} heading="Response Time (ms)" param={logDetails?.responseTime || ''} />
//           <ViewFormField sm={6} heading="Machine Serial No." param={logDetails?.machine?.[0]?.serialNo || ''} />
//           <ViewFormField sm={6} heading="Customer Name" param={logDetails?.customer?.name || ''} />
//           <ViewFormField sm={6} heading="Additional Context" param={logDetails?.additionalContextualInformation || ''} />
//         </Grid>
//        </DialogContent>
//       <DialogActions>
//         <Button variant="outlined" onClick={onClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// ApiLogsViewForm.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   logDetails: PropTypes.object,
//   requestMethodColor: PropTypes.string,
//   responseStatusColor: PropTypes.string,
// };

// export default ApiLogsViewForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';  

function DialogViewApiLogDetails({ open, onClose, logDetails }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" aria-labelledby="api-log-dialog-title" aria-describedby="api-log-dialog-description" fullWidth>
      <DialogTitle variant="h3" sx={{ pb: 1, pt: 2 }}>API Log Details</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ px: 3, pt: 2 }}>
        <CodeMirror
          value={JSON.stringify(logDetails, null, 2)}  
          editable={false}
          disableTopBar
          autoHeight
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogViewApiLogDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  logDetails: PropTypes.object,
};

export default DialogViewApiLogDetails;

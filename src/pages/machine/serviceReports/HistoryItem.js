import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import CopyIcon from '../../../components/Icons/CopyIcon';
import ViewFormServiceReportVersionAudit from '../../../components/ViewForms/ViewFormServiceReportVersionAudit';

const HistoryItem = ({ title, historyItem }) => {

  return (
          <TableRow key={childRow._id} sx={{ backgroundColor: 'none',}} >
            <Grid item md={12} sx={{mt: childIndex !==0 && 0.5, p:1,  border: '1px solid #e8e8e8',  borderRadius:'7px',backgroundColor: 'white' }} >
              <Grid sx={{ alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                {historyItem?.comments && (
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    { title && <b>{`${title}: `}</b>}
                    {` ${historyItem?.comments || ''}`}
                    {historyItem?.comments?.trim() && <CopyIcon value={historyItem?.comments} />}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <ViewFormServiceReportVersionAudit value={historyItem} />
          </TableRow>
        );
};


HistoryItem.propTypes = {
  title: PropTypes.string,
  historyItem: PropTypes.object,
};

export default HistoryItem;

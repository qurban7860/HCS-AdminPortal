import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Card,
  DialogActions,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import ViewFormField from '../ViewForms/ViewFormField';
import { getEmail } from '../../redux/slices/email/emails';
import { fDateTime } from '../../utils/formatTime';

function DialogEmailViewDetails({ open, setOpenDialog, emailId }) {
  const [showFullBody, setShowFullBody] = useState(false);
  const { email, isLoading } = useSelector((state) => state.emails);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmail(emailId));
  }, [dispatch, emailId]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
      <DialogTitle variant="h3" sx={{ pb: 1, pt: 2 }}>
        Email Details
      </DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent>
        <Grid>
          <Card sx={{ p: 3 }}>
            <Grid container>
              <ViewFormField sm={6} heading="From" param={email?.fromEmail || 'N/A'} isLoading={isLoading} />
              <ViewFormField sm={6} heading="Date" param={fDateTime(email?.createdAt) || 'N/A'} isLoading={isLoading} />
              <ViewFormField
                sm={6}
                heading="To"
                param={email?.toEmails?.join(', ') || 'N/A'}
                isLoading={isLoading}
              />
              <ViewFormField sm={6} heading="Subject" param={email?.subject || 'N/A'} isLoading={isLoading} />
              {email?.body ? (
                <ViewFormField
                  sm={12}
                  heading="Body"
                  style={{ width: '700px' }}
                  param={(
                      <div>
                        <iframe
                          srcDoc={email?.body}
                          style={{
                            width: '700px',
                            height: showFullBody ? '500px' : '100px',
                            border: 'none',
                            overflow: 'hidden',
                            transition: 'height 0.3s ease',
                          }}
                          title="email-body"
                        />
                        <button
                          type="button"
                          onClick={() => setShowFullBody((prev) => !prev)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2065D1',
                            cursor: 'pointer',
                            padding: '8px 0',
                            width: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {showFullBody ? 'Show Less' : 'Show More'}
                        </button>
                      </div>
                    )}
                />
              ) : null}
              <ViewFormField
                sm={6}
                heading="Customer Name"
                param={email?.customer?.name || 'N/A'}
                isLoading={isLoading}
              />
              <ViewFormField sm={6} heading="Updated At" param={fDateTime(email?.updatedAt) || 'N/A'} isLoading={isLoading} />
            </Grid>
          </Card>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogEmailViewDetails;

DialogEmailViewDetails.propTypes = {
  open: PropTypes.bool,
  setOpenDialog: PropTypes.func,
  emailId: PropTypes.string.isRequired,
};

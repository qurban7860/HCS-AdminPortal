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
import { useNavigate } from 'react-router-dom';

import ViewFormField from '../ViewForms/ViewFormField';
import { getEmail } from '../../redux/slices/email/emails';
import { fDateTime } from '../../utils/formatTime';
import { PATH_SUPPORT, PATH_CRM, PATH_MACHINE, PATH_REPORTS, PATH_SETTING, PATH_CALENDAR } from '../../routes/paths';
import LinkTableCellWithIconTargetBlank from '../ListTableTools/LinkTableCellWithIconTargetBlank';

function EmailViewDialog({ open, setOpenDialog, emailId }) {
  const [showFullBody, setShowFullBody] = useState(false);
  const { email, isLoading } = useSelector((state) => state.emails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prefix = JSON.parse(localStorage.getItem('configurations'))?.find((config) => config?.name?.toLowerCase() === 'ticket_prefix')?.value?.trim() || '';

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
              <ViewFormField sm={12} heading="To" param={email?.toEmails?.join(', ') || 'N/A'} isLoading={isLoading} />
              <ViewFormField sm={12} heading="Subject" param={email?.subject || 'N/A'} isLoading={isLoading} />

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
              <ViewFormField sm={6} heading="Customer Name" param={email?.customer?.name || email?.ticket?.customer?.name || email?.user?.customer?.name || email?.serviceReport?.customer?.name || 'N/A'} isLoading={isLoading} />

              {email?.ticket?.ticketNo && (
                <ViewFormField sm={6} heading="Ticket No" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_SUPPORT.supportTickets.view(email.ticket._id))}
                      onClick={() => window.open(PATH_SUPPORT.supportTickets.view(email.ticket._id), '_blank')}
                      param={`${prefix || ''}${prefix ? "-" : ""}${email?.ticket?.ticketNo || ""}`}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

              {email?.serviceReport?.serviceReportUID && (
                <ViewFormField sm={6} heading="Service Report" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_MACHINE.machines.serviceReports.view(email.machine._id, email.serviceReport?._id))}
                      onClick={() => window.open(PATH_MACHINE.machines.serviceReports.view(email.machine._id, email.serviceReport?._id), '_blank')}
                      param={email.serviceReport.serviceReportUID}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

              {email?.machine?.serialNo && (
                <ViewFormField sm={6} heading="Machine Serial No" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_MACHINE.machines.view(email.machine._id))}
                      onClick={() => window.open(PATH_MACHINE.machines.view(email.machine._id), '_blank')}
                      param={email.machine.serialNo}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

              {email?.event?._id && (
                <ViewFormField sm={6} heading="Event" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_CALENDAR.root)}
                      onClick={() => window.open(PATH_CALENDAR.root, '_blank')}
                      param={email.event.title || email.event._id}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

              {email?.customer?.name && (
                <ViewFormField sm={6} heading="Customer" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_CRM.customers.view(email.customer._id))}
                      onClick={() => window.open(PATH_CRM.customers.view(email.customer._id), '_blank')}
                      param={email.customer.name}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

              {email?.user?.name && (
                <ViewFormField sm={6} heading="User" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_SETTING.security.users.view(email.user._id))}
                      onClick={() => window.open(PATH_SETTING.security.users.view(email.user._id), '_blank')}
                      param={email.user.name}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

              {email?.inviteUser?.email && (
                <ViewFormField sm={6} heading="Invited User" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_SETTING.invite.view(email.inviteUser._id))}
                      onClick={() => window.open(PATH_SETTING.invite.view(email.inviteUser._id), '_blank')}
                      param={email.inviteUser.email}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

              {email?.dbBackup?.name && (
                <ViewFormField sm={6} heading="DB Backup" isLoading={isLoading}
                  param={
                    <LinkTableCellWithIconTargetBlank
                      onViewRow={() => navigate(PATH_REPORTS.logs.dbBackup.search(email?.dbBackup?.name))}
                      onClick={() => window.open(PATH_REPORTS.logs.dbBackup.search(email?.dbBackup?.name), '_blank')}
                      param={email?.dbBackup?.name || "Database Backup"}
                      sx={{ ml: -2, mt: -2 }}
                    />
                  }
                />
              )}

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

export default EmailViewDialog;

EmailViewDialog.propTypes = {
  open: PropTypes.bool,
  setOpenDialog: PropTypes.func,
  emailId: PropTypes.string.isRequired,
};

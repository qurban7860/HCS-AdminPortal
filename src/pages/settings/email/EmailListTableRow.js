import PropTypes from 'prop-types';
import {
  TableCell,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
// utils
import { useState } from 'react';
import DialogLink from '../../../components/Dialog/DialogLink';
import axios from '../../../utils/axios';
import { fDateTime } from '../../../utils/formatTime';
import { StyledTableRow, StyledTooltip } from '../../../theme/styles/default-styles';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';
import EmailViewform from './EmailViewform'; // Assuming EmailViewform.js is in the same folder
import { CONFIG } from '../../../config-global';



// ----------------------------------------------------------------------

EmailListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
};

export default function EmailListTableRow({
  row,
  selected,
  onViewRow,
  hiddenColumns,
}) {
  const { subject, customer, toEmails, createdAt, fromEmail} = row;

  // State to manage the dialog visibility
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogData, setOpenDialogData] = useState(null);

  // Function to handle dialog open
  const handleOpenDialog = (rowId) => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${CONFIG.SERVER_URL}emails/${rowId}`);
        const emailData = {
          ...response.data,
          customerName: response.data.customer?.name || '',
          toEmail: response.data.toEmails?.[0] || '',
          toUsers: response.data.toUsers?.[0] || ''
        };
        setOpenDialogData(emailData);
        setOpenDialog(true);
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };
    fetchData();
  };

  // Function to handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <StyledTableRow
        hover
        selected={selected}
      >
        {!hiddenColumns?.toEmails && 
          <TableCell align='left'>
            {Array.isArray(toEmails) && toEmails.length > 1 ? (
              <StyledTooltip

                title={toEmails.slice(1).join(', ')}
                placement="top"
                tooltipcolor="#2065D1"
              >
                <span>{toEmails[0]} ,...</span>
              </StyledTooltip>
            ) : (
              toEmails?.[0] || ''
            )}
          </TableCell>
        }
        {!hiddenColumns?.fromEmail &&
          <TableCell align='left'>
            {fromEmail || ''}
          </TableCell>
        }

        {!hiddenColumns?.subject &&
          <Stack direction="row" alignItems="center">
            <CustomAvatar
              name={subject}

              alt={subject}
              sx={{ ml: 1, my: 0.5, width: '30px', height: '30px' }}
            />
            <TableCell 
              align='left' 
              sx={{ 
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={() => handleOpenDialog(row?._id)}
            >
              {subject || ''}
            </TableCell>
          </Stack>
        }
        {!hiddenColumns?.["customer.name"] &&
          <TableCell align='left' >
            {customer?.name || ''}
          </TableCell>
        }

        {!hiddenColumns?.createdAt &&
          <TableCell align='right'>
            {fDateTime(createdAt)}
          </TableCell>
        }

      </StyledTableRow>
      {/* Dialog to show EmailViewform */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Email Details</DialogTitle>
      <Divider orientation="horizontal" flexItem />
        <DialogContent>
          <EmailViewform emailData={openDialogData} />
        </DialogContent>
        <DialogLink
        onClose={handleCloseDialog}
      />
      </Dialog>
    </>
  );
}

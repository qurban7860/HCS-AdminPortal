import PropTypes from 'prop-types';
import {
  TableCell,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
// utils
import { useState } from 'react';
import axios from '../../../utils/axios';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import { fDateTime } from '../../../utils/formatTime';
import { StyledTableRow } from '../../../theme/styles/default-styles';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';
import EmailViewform from './EmailViewform'; // Assuming EmailViewform.js is in the same folder
import Iconify from '../../../components/iconify';
import { CONFIG } from '../../../config-global';


// ----------------------------------------------------------------------

EmailListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function EmailListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const { subject, customer, toEmails, createdAt } = row;

  // State to manage the dialog visibility
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogData, setOpenDialogData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle dialog open
  const handleOpenDialog = (rowId) => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${CONFIG.SERVER_URL}emails/${rowId}`);
        const emailData = {
          ...response.data,
          customerName: response.data.customer?.name || '',
          toEmail: response.data.toEmails?.[0] || '',
          toUsers: response.data.toUsers?.[0] || ''
        };
        setOpenDialogData(emailData);
        setIsLoading(false);
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
      {isLoading && <LoadingScreen />}
      <StyledTableRow
        hover
        selected={selected}
        onClick={() => handleOpenDialog(row?._id)} // Open dialog on row click
        style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
      >
        <TableCell align='left' sx={{ maxWidth: '200px' }}>
          {Array.isArray(toEmails) && toEmails?.join(', ')}
        </TableCell>
        <Stack direction="row" alignItems="center">
          <CustomAvatar
            name={subject}
            alt={subject}
            sx={{ ml: 1, my: 0.5, width: '30px', height: '30px' }}
          />
          <TableCell align='left' sx={{ maxWidth: '400px', fontWeight: 'bold' }}>
            {subject || ''}
          </TableCell>
        </Stack>
        <TableCell align='left' sx={{ maxWidth: '200px' }}>
          {customer?.name || ''}
        </TableCell>
        <TableCell align='right' sx={{ maxWidth: '200px' }}>
          {fDateTime(createdAt)}
        </TableCell>
      </StyledTableRow>

      {/* Dialog to show EmailViewform */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            Email Details
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                width: 44,
                height: 44
              }}
            >
              <Iconify icon="eva:close-fill" width={24} height={24} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <EmailViewform emailData={openDialogData} />
        </DialogContent>
      </Dialog>
    </>
  );
}

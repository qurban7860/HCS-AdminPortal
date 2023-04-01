import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment,TextField } from '@mui/material';
import Iconify from '../../components/iconify';

AddButtonAboveAccordion.propTypes = {
  name: PropTypes.string,
  FormVisibility: PropTypes.bool,
  toggleChecked: PropTypes.func,
  };
export default function AddButtonAboveAccordion({name,toggleChecked,FormVisibility}) {
    return (
      <>
        <Stack alignItems="flex-end" sx={{  px: 4,mb:2, mt:-1 }}>
            <Button
                onClick={toggleChecked}
                variant="contained"
                startIcon={!FormVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />}
                >
                {name} 
            </Button>
        </Stack>
      </>
    )
}
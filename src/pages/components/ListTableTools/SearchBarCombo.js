import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, InputAdornment, Button, Stack } from '@mui/material';
import { BUTTONS } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import useResponsive from '../../../hooks/useResponsive';

function SearchBarCombo({
  isFiltered,
  value,
  onChange,
  onClick,
  SubOnClick,
  addButton,
  buttonIcon,
  ...other
}) {
  const isMobile = useResponsive('sm', 'down');
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12} sm={9} sx={{ display: 'inline-flex' }}>
        <TextField
          fullWidth={isMobile}
          size="small"
          value={value}
          onChange={onChange}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />{' '}
              </InputAdornment>
            ),
          }}
          sx={{
            width: isFiltered ? '80%' : '100%',
          }}
        />
        {isFiltered && (
          <Button
            color="error"
            sx={{ flexShrink: 0, ml: 1 }}
            onClick={onClick}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            {BUTTONS.CLEAR}
          </Button>
        )}
      </Grid>
      {addButton && <Grid item xs={12} sm={3}>
        <Stack alignItems="flex-end">
          <Button
            fullWidth
            sx={{ p: 1, width: '100%' }}
            onClick={SubOnClick}
            variant="contained"
            startIcon={<Iconify icon={buttonIcon || 'eva:plus-fill'} />}
          >
            {addButton}
          </Button>
        </Stack>
      </Grid>}
    </Grid>
  );
}

SearchBarCombo.propTypes = {
  isFiltered: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  SubOnClick: PropTypes.func,
  addButton: PropTypes.string,
  buttonIcon: PropTypes.string,
};

export default SearchBarCombo;

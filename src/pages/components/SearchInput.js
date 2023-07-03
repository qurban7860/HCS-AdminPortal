import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, TextField, InputAdornment } from '@mui/material';
import Iconify from '../../components/iconify';

function SearchInput({
  filterName,
  handleFilterName,
  isFiltered,
  handleResetFilter,
  searchFormVisibility,
  disabled,
}) {
  return (
    <Grid container sx={{ display: 'inline-flex' }} p={1}>
      <Grid item md={isFiltered ? 10 : 12}>
        {!searchFormVisibility && (
          <TextField
            fullWidth
            disabled={disabled}
            value={filterName}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 1, mb: 0 }}
          />
        )}
      </Grid>
      {isFiltered && (
        <Grid item md={2}>
          <Button
            color="error"
            sx={{ p: 2, ml: 1 }}
            onClick={handleResetFilter}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            Clear
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

SearchInput.propTypes = {
  filterName: PropTypes.string,
  handleFilterName: PropTypes.func,
  isFiltered: PropTypes.string,
  handleResetFilter: PropTypes.func,
  searchFormVisibility: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SearchInput;

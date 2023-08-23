import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, TextField, InputAdornment } from '@mui/material';
import Iconify from '../../../components/iconify';
import { BUTTONS } from '../../../constants/default-constants';

function SearchInput({
  filterName,
  handleFilterName,
  isFiltered,
  isSearchBar,
  handleResetFilter,
  searchFormVisibility,
  disabled,
  size,
  padding,
  display,
}) {
  return (
    <Grid container rowSpacing={1} mb={1}>
      <Grid item xs={12} md={12} sx={{ display: { display } }}>
        {!searchFormVisibility && (
          <TextField
            fullWidth
            disabled={disabled}
            value={filterName}
            size={size}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        )}
        {isFiltered && (
          <Button
            color="error"
            sx={{ flexShrink: 0, ml: 1 }}
            onClick={handleResetFilter}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            {BUTTONS.CLEAR}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

SearchInput.propTypes = {
  filterName: PropTypes.string,
  handleFilterName: PropTypes.func,
  isFiltered: PropTypes.bool,
  isSearchBar: PropTypes.bool,
  handleResetFilter: PropTypes.func,
  searchFormVisibility: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  padding: PropTypes.number,
  display: PropTypes.string,
};

SearchInput.defaultProps = {
  padding: 2,
  size: 'small',
  display: 'inline-flex',
};

/**
 * @param {isSearchBar} boolean - if true, then it will have no padding
 */

export default SearchInput;

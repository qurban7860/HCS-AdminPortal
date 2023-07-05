import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, TextField, Button, InputAdornment } from '@mui/material';
import AddButtonAboveAccordion from './AddButtonAboveAcoordion';
import Iconify from '../../../components/iconify';
import { BUTTONS } from '../../../constants/default-constants';

function SearchInputAndAddButton({
  searchFormVisibility,
  filterName,
  handleFilterName,
  addButtonName,
  isFiltered,
  handleResetFilter,
  toggleChecked,
  toggleCancel,
  FormVisibility,
}) {
  return (
    <Grid container direction={{ sm: 'column', lg: 'row' }} justifyContent="flex-end">
      <Grid item xs={12} md={8}>
        <Grid container direction={{ sm: 'column', lg: 'row' }} justifyContent="flex-start">
          <Grid item xs={10} sm={8} md={10}>
            {!searchFormVisibility && (
              <TextField
                size="small"
                fullWidth
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
          <Grid item xs={2} md={2}>
            {isFiltered && (
              <Button
                color="error"
                sx={{ ml: 1 }}
                onClick={handleResetFilter}
                startIcon={<Iconify icon="eva:trash-2-outline" />}
              >
                {BUTTONS.CLEAR}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item justifyContent="flex-end" sx={12} md={4}>
        <AddButtonAboveAccordion
          name={addButtonName}
          toggleChecked={toggleChecked}
          toggleCancel={toggleCancel}
          FormVisibility={FormVisibility}
        />
      </Grid>
    </Grid>
  );
}

SearchInputAndAddButton.propTypes = {
  searchFormVisibility: PropTypes.string,
  filterName: PropTypes.string,
  handleFilterName: PropTypes.func,
  addButtonName: PropTypes.string,
  isFiltered: PropTypes.string,
  handleResetFilter: PropTypes.func,
  toggleChecked: PropTypes.func,
  toggleCancel: PropTypes.func,
  FormVisibility: PropTypes.bool,
};

export default SearchInputAndAddButton;

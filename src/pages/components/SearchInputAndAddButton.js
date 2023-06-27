import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, TextField, Button, InputAdornment } from '@mui/material';
import BreadcrumbsProducer from './BreadcrumbsProducer';
import AddButtonAboveAccordion from './AddButtonAboveAcoordion';
import Iconify from '../../components/iconify';

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
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 4, pl: 2 }}
    >
      <Grid container>
        <Grid item xs={12} md={12} sx={{ display: 'inline-flex' }}>
          <Grid item xs={12} sm={8} md={8}>
            {!searchFormVisibility && (
              <TextField
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
          <Grid item md={2}>
            {isFiltered && (
              <Button
                color="error"
                sx={{ p: 2, ml: 1 }}
                onClick={handleResetFilter}
                startIcon={<Iconify icon="eva:trash-2-outline" />}
              >
                Clear
              </Button>
            )}
          </Grid>
          <Grid item justifyContent="flex-end" md={2}>
            <Stack alignItems="flex-end" sx={{ padding: 2 }}>
              <AddButtonAboveAccordion
                name={addButtonName}
                toggleChecked={toggleChecked}
                toggleCancel={toggleCancel}
                FormVisibility={FormVisibility}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
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

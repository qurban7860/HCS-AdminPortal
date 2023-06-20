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
  path,
  path2,
  path3,
  path4,
  name,
  name2,
  name3,
  name4,
  step,
  step2,
  step3,
  step4,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 2, pl: 2, pb: 1 }}
    >
      <Grid container>
        <Grid item xs={12} md={12} sx={{ display: 'inline-flex', mb: -1 }}>
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
        <Grid item md={12}>
          <BreadcrumbsProducer
            underline="none"
            step={step}
            step2={step2}
            step3={step3}
            step4={step4}
            path={path}
            name={name}
            path2={step2 && path2}
            name2={step2 && name2}
            path3={step3 && path3}
            name3={step3 && name3}
            path4={step4 && path4}
            name4={step4 && name4}
            // path4={PATH_DASHBOARD.customer}
            // name4={
            //   <Stack>
            //     {customerDocumentFormVisibility
            //       ? `Edit ${customerDocument?.name}`
            //       :  && currentSiteData.name}
            //     {siteAddFormVisibility && !isExpanded && 'New Site Form'}
            //   </Stack>
            // }
          />
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
  path: PropTypes.string,
  path2: PropTypes.string,
  path3: PropTypes.string,
  path4: PropTypes.string,
  name: PropTypes.string,
  name2: PropTypes.string,
  name3: PropTypes.string,
  name4: PropTypes.string,
  step: PropTypes.string,
  step2: PropTypes.string,
  step3: PropTypes.string,
  step4: PropTypes.string,
};

export default SearchInputAndAddButton;

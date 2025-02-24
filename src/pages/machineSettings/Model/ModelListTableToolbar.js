import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @mui
import { Stack, Autocomplete, TextField, Box } from '@mui/material';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

CustomerListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  selectedCategory: PropTypes.object,
  setSelectedCategory: PropTypes.func,
};

export default function CustomerListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  selectedCategory,
  setSelectedCategory,
}) {
  const navigate = useNavigate();
  const { activeCategories } = useSelector((state) => state.category);
  const toggleAdd = () => navigate(PATH_MACHINE.machineSettings.models.new);

  return (
    <Stack
    {...options}
    direction="row" 
    spacing={2} 
    alignItems="center" 
    justifyContent="flex-start"
  >
    <Box sx={{ flex: 2 }}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        node={
          <Autocomplete
        value={selectedCategory || null}
        options={activeCategories}
        getOptionLabel={(option) => `${option?.name || ''}`}
        isOptionEqualToValue={(option, value) => option?._id === value?._id}
        sx={{ maxWidth: '225px' }}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedCategory(newValue);
          } else {
            setSelectedCategory(null);
          }
        }}
        renderOption={(props, option) => (
          <li {...props} key={option?._id}>
            {`${option?.name || ''}`}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} size="small" label="Categories" />
        )}
      />}
        machineSettingPage
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDMODEL}
      />
    </Box>
  </Stack>
  
  );
}


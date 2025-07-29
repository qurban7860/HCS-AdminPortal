import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Button } from '@mui/material';
// redux
// import { useDispatch } from '../../redux/store';
// components
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
import Iconify from '../../../../components/iconify';
import { PATH_SETTING } from '../../../../routes/paths';
import { BUTTONS } from '../../../../constants/default-constants';
import { options } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

// Add this constant at the top
const TYPE_OPTIONS = ['All', 'AUTH','ERROR-PAGES','NORMAL-CONFIG','ADMIN-CONFIG','MACHINE-INTEGRATION', 'RESPONSE'];

ConfigListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  filterType: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onFilterType: PropTypes.func,
  onResetFilter: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  onSort: PropTypes.func,
};

export default function ConfigListTableToolbar({
  isFiltered,
  filterName,
  filterRole,
  filterType,
  optionsRole,
  onFilterName,
  onFilterRole,
  onFilterType,
  onResetFilter,
  sortBy,
  sortOrder,
  onSort,
}) {
  const navigate = useNavigate();
  
  // const dispatch = useDispatch();
  const linkTo = () => {
    navigate(PATH_SETTING.configs.new);
  };

  // Only show search bar clear button if there's text in the search
  const showSearchClear = filterName !== '';

  return (
    <Stack spacing={2}>
      <Stack 
        {...options} 
        direction="row" 
        alignItems="center" 
        spacing={2}
      >
        <SearchBarCombo
          isFiltered={showSearchClear}  // Changed from isFiltered to showSearchClear
          value={filterName}
          onChange={onFilterName}
          onClick={onResetFilter}
          SubOnClick={linkTo}
          addButton={BUTTONS.ADDCONFIG}
          settingPage
          filterType={filterType}
          onFilterType={onFilterType}
          typeOptions={TYPE_OPTIONS}
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ px: 4, pb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color={sortBy === 'name' ? 'primary' : 'inherit'}
            onClick={() => onSort('name')}
            startIcon={sortBy === 'name' && <Iconify icon={sortOrder === 'asc' ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'} />}
            variant={sortBy === 'name' ? 'contained' : 'outlined'}
          >
            A-Z
          </Button>
          <Button
            size="small"
            color={sortBy === 'createdAt' ? 'primary' : 'inherit'}
            onClick={() => onSort('createdAt')}
            startIcon={sortBy === 'createdAt' && <Iconify icon={sortOrder === 'asc' ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'} />}
            variant={sortBy === 'createdAt' ? 'contained' : 'outlined'}
          >
            Created Date
          </Button>
          <Button
            size="small"
            color={sortBy === 'updatedAt' ? 'primary' : 'inherit'}
            onClick={() => onSort('updatedAt')}
            startIcon={sortBy === 'updatedAt' && <Iconify icon={sortOrder === 'asc' ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'} />}
            variant={sortBy === 'updatedAt' ? 'contained' : 'outlined'}
          >
            Updated Date
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

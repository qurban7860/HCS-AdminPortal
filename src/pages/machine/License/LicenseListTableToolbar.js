import PropTypes from 'prop-types';
// import { sentenceCase } from 'change-case';
// @mui
import { Stack } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../../redux/store';
// components
import { SearchBarCombo } from '../../../components/ListTableTools'
import { setLicenseFormVisibility } from '../../../redux/slices/products/license';
// constants
import { BUTTONS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

LicenseListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function LicenseListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleAdd = () => dispatch(setLicenseFormVisibility(true));
  const { machine } = useSelector((state) => state.machine);
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ px: 2.5, py: 3 }}
      >
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDLICENSE}
        transferredMachine={machine?.status?.slug==='transferred'}
      />
    </Stack>
  );
}

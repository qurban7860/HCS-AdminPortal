import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// components
import { SearchBarCombo } from '../../../../components/ListTableTools'
import { BUTTONS } from '../../../../constants/default-constants';
import { PATH_CRM } from '../../../../routes/paths';
import { setNewMachineCustomer } from '../../../../redux/slices/customer/customer';
import { useDispatch, useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

MachineListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  transferStatus: PropTypes.bool,
  handleTransferStatus: PropTypes.func,
};

export default function MachineListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  transferStatus,
  handleTransferStatus
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);

  const toggleAdd = async () => {
    await dispatch(setNewMachineCustomer(customer))
    navigate(PATH_CRM.customers.machines.new(customer?._id));
  };

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
      radioStatus={transferStatus}
      radioStatusLabel='Show Transferred'
      handleRadioStatus={handleTransferStatus}
      SubOnClick={toggleAdd}
      addButton={BUTTONS.NEWMACHINE}
      machinePage
    />
  </Stack>
  );
}

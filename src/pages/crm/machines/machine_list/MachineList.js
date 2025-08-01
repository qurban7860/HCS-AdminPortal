import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import { Table, TableBody, TableContainer } from '@mui/material';
// redux
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
// components
import { useSettingsContext } from '../../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationFilter,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
// sections
import MachineListTableRow from './MachineListTableRow';
import MachineListTableToolbar from './MachineListTableToolbar';

import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { getCustomerMachines, resetCustomerMachines, ChangeRowsPerPage,
  ChangePage,
  setMachineDialog,
  getMachineForDialog, } from '../../../../redux/slices/products/machine';
import { PATH_MACHINE, PATH_CRM } from '../../../../routes/paths';

export default function MachineList() {
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  useSettingsContext();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [transferStatus, setTransferStatus] = useState(false);
  
  const { customerMachines, page, rowsPerPage, isLoading } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { customerId } = useParams() 
  const navigate = useNavigate();

  const TABLE_HEAD = [
    { id: 'serialNo', label: 'SerialNo'},
    { id: 'name', visibility: 'xs1', label: 'Name'},
    { id: 'machineModel.name', label: 'Model'},
    { id: 'status.name', label: 'Status'},
    { id: 'instalationSite.address.country', label: 'Address'},
    { id: 'action', label: ''},
  ];

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(()=>{
    if(customerId){
      dispatch(getCustomerMachines(customerId , customer?.isArchived ));
    }
    return ()=> { dispatch(resetCustomerMachines())}
},[dispatch, customerId, customer?.isArchived ])

  useEffect(() => {
    setTableData(customerMachines);
  }, [customerMachines]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    transferStatus
  });  
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    // dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  
  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewMachine = (machineId) => {
    const url = PATH_MACHINE.machines.view(machineId);
    window.open(url, '_blank');
  };

  const handleViewRow = async ( machineId ) => {
    await dispatch(getMachineForDialog(machineId)); 
    await dispatch(setMachineDialog(true));
  };

  const handleMoveMachine = (id) => {
    if(customerId && id ){
      navigate(PATH_CRM.customers.machines.move(customerId, id));
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  const handleTransferStatus = (status) => {
    setTransferStatus(status);
  }

  return (
      <TableCard>
        <MachineListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          transferStatus={transferStatus}
          handleTransferStatus={handleTransferStatus}
        />
          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size="small" sx={{ minWidth: 360 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onSort={onSort}
              />
              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <MachineListTableRow
                        key={row._id}
                        row={row}
                        onClick={() => handleViewMachine(row?._id)}
                        onViewRow={() => handleViewRow(row?._id)}
                        onMoveMachine={() => handleMoveMachine(row?._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationFilter
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </TableCard>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, transferStatus }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  
  if(!transferStatus)
    inputData = inputData.filter((machine) => machine?.status ? machine.status.slug !== 'transferred' : machine );

  if (filterName) {
    inputData = inputData.filter(
      (machine) =>{
        const address = {};
        address.city = machine?.instalationSite?.address?.city;
        address.region = machine?.instalationSite?.address?.region;
        address.country = machine?.instalationSite?.address?.country;
        const addressFilter = Object.values(address ?? {}).map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter((value) => value !== '').join(', ');
      return machine?.serialNo?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        machine?.name?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        machine?.machineModel?.name?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        addressFilter?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(machine?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
      }
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((noteg) => filterStatus.includes(noteg.status));
  }
  return inputData;
}

import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import SettingListTableRow from './SettingListTableRow';
import SettingListTableToolbar from './SettingListTableToolbar';
import MachineTabContainer from '../util/MachineTabContainer';
import { getSettings, getSettingSuccess, setSettingValueDialog, ChangeRowsPerPage, ChangePage, setFilterBy } from '../../../redux/slices/products/machineSetting';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineSettingValueDialog from '../../../components/Dialog/MachineSettingValueDialog';

export default function SettingList() {
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });
  const { machineId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const { machine } = useSelector((state) => state.machine);
  const { settings, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.machineSetting );
  const TABLE_HEAD = [
    { id: 'techParam.category.name', label: 'Category', align: 'left' },
    { id: 'techParam.name', label: 'Parameter Name', align: 'left' },
    { id: 'techParamValue', label: 'Parameter Value', align: 'left' },
    { id: 'updatedAt', visibility: 'xs1',  label: 'Updated At', align: 'left' },
    { id: 'history', label: 'History', align: 'left' },
    { id: 'edit', label: 'Edit', align: 'left' },
  ];
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    if(machineId){
      dispatch(getSettings( machineId, machine?.isArchived ));
    }
  }, [dispatch, machineId, machine ]);

  useEffect(() => {
    setTableData(settings);
  }, [settings]);
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });  
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = (id) => navigate(PATH_MACHINE.machines.settings.view( machineId, id));

  const handleMachineSettingValueDialog = async (row ) => {
    await dispatch(setSettingValueDialog(true));
    await dispatch(getSettingSuccess( row ));
  };
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='settings' />
      <TableCard>
        <SettingListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          transferred
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
                      <SettingListTableRow
                        key={row._id}
                        row={row}
                        onViewRow={() => handleViewRow(row?._id)}
                        handleDialog={ () => handleMachineSettingValueDialog( row ) }
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
      <MachineSettingValueDialog />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (ssetting) =>
        ssetting?.techParam.name?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        ssetting?.techParam?.category?.name?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        ssetting?.techParamValue?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(ssetting?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((ssetting) => filterStatus.includes(ssetting.status));
  }

  return inputData;
}

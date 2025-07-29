import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
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
  TableSelectedAction,
  TablePaginationFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import HistoricalConfigurationsTableRow from './HistoricalConfigurationsTableRow';
import HistoricalConfigurationsListTableToolbar from './HistoricalConfigurationsListTableToolbar';
import { getHistoricalConfigurationRecords, ChangeRowsPerPage, ChangePage, setFilterBy, setSelectedINIs } from '../../../redux/slices/products/historicalConfiguration';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import ConfirmDialog from '../../../components/confirm-dialog';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'checkboxes', label: 'Status', align: 'left' },
  { id: 'backupid', label: 'Backup Id', align: 'left' },
  { id: 'backupDate', label: 'Backup Date', align: 'center' },
  { id: 'isManufacture', label: 'Manufacture', align: 'center' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdBy.name', label: 'Created By', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function HistoricalConfigurationsList() {
  const { machine } = useSelector((state) => state.machine);
  const { historicalConfigurations, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.historicalConfiguration );
  const navigate = useNavigate();
  const { machineId } = useParams();
  const dispatch = useDispatch();

  const {
    order,
    orderBy,
    setPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  useLayoutEffect(() => {
    if(machineId){
      dispatch(getHistoricalConfigurationRecords(machineId, machine?.isArchived )); 
    }
  }, [dispatch, machineId, machine ]);

  useEffect(() => {
    if (initial) {
      setTableData(historicalConfigurations);
    }
  }, [historicalConfigurations, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const denseHeight = 60;

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

  const handleViewRow = async (id) => navigate(PATH_MACHINE.machines.ini.view(machineId, id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleCompareINIs = async () => {
    await dispatch(setSelectedINIs(selected));
    await navigate(PATH_MACHINE.machines.ini.compare(machineId))
  }

  const handleSelectRow = (row) => {
    if (selected.includes(row) || selected.length < 2) {
      onSelectRow(row);
    } else {
      setOpenConfirm(true);
    }
  };

  return (
    <Container maxWidth={false} >
        <MachineTabContainer currentTabValue='ini' />
        <TableCard>
          <HistoricalConfigurationsListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            onCompareINI={dataFiltered.length >0? handleCompareINIs:null}
          />

          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

          {/* {selected?.length === 2 && 
            <TableSelectedAction
              dense
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  selected.length > 1 ? [] : tableData.slice(0, 2).map((row) => row._id)
                )
              }
              action={
                <StyledTooltip title="Compare INI's" placement='top' disableFocusListener tooltipcolor={theme.palette.primary.main} color={theme.palette.text.primary}>
                  <Iconify onClick={() => getCompareInis(selected[0], selected[1])} color={theme.palette.primary.dark} sx={{ width: '42px', height: '29px', cursor: 'pointer' }}  icon='mdi:file-compare' />
                </StyledTooltip>
              }
            />
            } */}

            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onSort={onSort}
                    numSelected={selected.length}
                    
                  />
                  
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <HistoricalConfigurationsTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row._id)}
                          selected={selected.includes(row._id)}
                          selectedLength={selected.length}
                          onSelectRow={() => handleSelectRow(row._id)}
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

          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
        <ConfirmDialog
            open={openConfirm}
            onClose={ () => setOpenConfirm(false) }
            title="Compare maximum 2 INI's"
            content="Please select 2 INI's  only!"
            SubButton="Close"
          />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (docCategory) =>
        docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.createdByIdentifier?.name?.toLowerCase().includes(filterName.toLowerCase()) ||
        docCategory?.backupid?.toString()?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(docCategory?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}

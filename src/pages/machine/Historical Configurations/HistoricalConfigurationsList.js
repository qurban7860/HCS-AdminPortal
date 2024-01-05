import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import {
  Button,
  Tooltip, 
  IconButton,
  Table,
  TableBody,
  TableContainer
} from '@mui/material';
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
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import { useSnackbar } from '../../../components/snackbar';
// sections
import HistoricalConfigurationsTableRow from './HistoricalConfigurationsTableRow';
import HistoricalConfigurationsListTableToolbar from './HistoricalConfigurationsListTableToolbar';
import {
  getHistoricalConfigurationRecords,
  getHistoricalConfigurationRecord,
  getHistoricalConfigurationRecord2,
  setHistoricalConfigurationViewFormVisibility,
  setHistoricalConfigurationCompareViewFormVisibility,
  resetHistoricalConfigurationRecord,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../redux/slices/products/historicalConfiguration';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import ConfirmDialog from '../../../components/confirm-dialog';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'backupid', label: 'Backup Id', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdBy.name', label: 'Created By', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];
// ----------------------------------------------------------------------

export default function HistoricalConfigurationsList() {
  const { historicalConfigurations, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.historicalConfiguration );
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const {
    order,
    orderBy,
    setPage,
    //
    selected,
    setSelected,
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
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

// console.log("selected : ",selected)
  useLayoutEffect(() => {
    dispatch(getHistoricalConfigurationRecords(machine?._id)); 
    dispatch(setHistoricalConfigurationViewFormVisibility(false));
  }, [dispatch, machine?._id]);

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

  const handleViewRow = async (id) => {
    try{
      await dispatch(setHistoricalConfigurationViewFormVisibility(true));
      await dispatch(resetHistoricalConfigurationRecord())
      await dispatch(getHistoricalConfigurationRecord(machine._id, id));
    }catch(e){
      enqueueSnackbar(e, { variant: `error` });
      console.error(e);
    }

  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const getCompareInis = async (id1, id2) => {
    dispatch(setHistoricalConfigurationCompareViewFormVisibility(true));
    dispatch(getHistoricalConfigurationRecord( machine?._id, id1 ));
    dispatch(getHistoricalConfigurationRecord2( machine?._id, id2 ));
  }

  return (
    <>
        <TableCard>
          <HistoricalConfigurationsListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}

          />

          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

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
                  <Iconify onClick={() => getCompareInis(selected[0], selected[1])} color={theme.palette.primary.dark} sx={{ width: '28px', height: '28px', cursor: 'pointer' }}  icon='mdi:file-compare' />
                </StyledTooltip>
              }
            />

            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                  numSelected={selected.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      selected.length > 1 ? [] : tableData.slice(0, 2).map((row) => row._id)
                    )
                  }
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
                          onSelectRow={ ()=>  selected.length < 2 || selected.find((el) => el === row._id) ? onSelectRow(row._id) : setOpenConfirm(true) }
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

          {!isNotFound && <TablePaginationCustom
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
            title="Compare Two INI's"
            content="Please select two INI's  only!"
            SubButton="Close"
          />
    </>
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
  // (customer) => customer.name.toLowerCase().indexOf(filterName.toLowerCase()) || customer.tradingName.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.city.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.country.toLowerCase().indexOf(filterName.toLowerCase()) || customer.createdAt.toLowerCase().indexOf(filterName.toLowerCase()) !== -1

  if (filterName) {
    inputData = inputData.filter(
      (docCategory) =>
        docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docCategory?.backupid?.toString()?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (docCategory?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(docCategory?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}

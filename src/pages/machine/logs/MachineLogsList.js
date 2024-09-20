import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// routes
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { PATH_MACHINE_LOGS } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import MachineLogsListTableToolbar from './MachineLogsListTableToolbar';
import MachineLogsTableRow from './MachineLogsTableRow';
import {
  getMachineLogRecords,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../redux/slices/products/machineErpLogs';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';
import DialogViewMachineLogDetails from '../../../components/Dialog/DialogViewMachineLogDetails';
import useResponsive from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'componentLength', label: 'Length', align: 'left' },
  { id: 'waste', label: 'Waste', align: 'left' },
  // { id: 'createdBy.name', label: 'Created By', align: 'left' },
  // { id: 'createdAt', label: 'Created At', align: 'right' },
]

export default function MachineLogsList(){
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectedLogTypeTableColumns, setSelectedLogTypeTableColumns] = useState([]);
  const [openLogDetailsDialog, setOpenLogDetailsDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [archivedLogs, setArchivedLogs] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setArchivedLogs(searchParams.get('status') === 'archived');
  }, [searchParams])

  const isMobile = useResponsive('down', 'sm');

  const {
    machineErpLogs,
    machineErpLogstotalCount,
    dateFrom,
    dateTo,
    filterBy,
    page,
    rowsPerPage,
    isLoading,
    initial,
    selectedLogType,
  } = useSelector((state) => state.machineErpLogs);

  const { machineId } = useParams();
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'date', defaultOrder: 'asc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const location = useLocation();

  useLayoutEffect(() => {
    if (machineId && selectedLogType) {
      setSelectedLogTypeTableColumns(machineLogTypeFormats.find(logType => logType.type === selectedLogType.type)?.tableColumns);
      dispatch(
        getMachineLogRecords({
          machineId,
          page,
          pageSize: rowsPerPage,
          fromDate: dateFrom,
          toDate: dateTo,
          isMachineArchived: archivedLogs,
          selectedLogType: selectedLogType.type,
        })
      );
    }
  }, [dispatch, machineId, page, rowsPerPage, dateFrom, dateTo, selectedLogType, archivedLogs ]);

  useEffect(() => {
    if (initial) {
      setTableData(machineErpLogs?.data || [] );
    }
  }, [machineErpLogs, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isFiltered = filterName !== '';
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

  const toggleArchivedLogs = () => {
    if (archivedLogs) {
      setSearchParams({ status: 'active' });
    } else {
      setSearchParams({ status: 'archived' });
    }
  };

  // const handleViewRow = async (id) => navigate(PATH_MACHINE.machines.logs.view(machineId, `${selectedLogType?.type}_${id}`));

  const handleViewRow = (id) => {
    const log = dataFiltered.find((item) => item._id === id);
    setSelectedLog(log);
    setOpenLogDetailsDialog(true);
  };
  

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
    <Container maxWidth={false}>
      { location.pathname !== PATH_MACHINE_LOGS.root ? <MachineTabContainer currentTabValue='logs' /> : undefined } 
      <TableCard>
        <MachineLogsListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          logTypes={machineLogTypeFormats}
          toggleArchivedLogs={toggleArchivedLogs}
          archivedLogs={archivedLogs}
        />

        {/* {!isNotFound && !isMobile &&(
          <TablePaginationFilter
            columns={selectedLogTypeTableColumns?.map((column) => column.label)}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={machines? machines.length : 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )} */}

        {!isNotFound && (
          <TablePaginationCustom
            count={machineErpLogstotalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size="small" sx={{ minWidth: 360 }}>
              <TableHead>
                <TableRow>
                  {(location.pathname === PATH_MACHINE_LOGS.root ? TABLE_HEAD : undefined || selectedLogTypeTableColumns)?.map((headCell, index) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.align || 'left'}
                      sortDirection={orderBy === headCell.id ? order : false}
                      sx={{ position: 'sticky', top: 0, width: headCell.width, minWidth: headCell.minWidth }}
                    >
                      {onSort ? (
                        <TableSortLabel
                          hideSortIcon
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={() => onSort(headCell.id)}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      ) : (
                        headCell.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered).map((row, index) =>
                  row ? (
                    <MachineLogsTableRow
                      key={row._id}
                      columnsToShow={selectedLogTypeTableColumns}
                      row={row}
                      onViewRow={() => handleViewRow(row._id)}
                      selected={selected.includes(row._id)}
                      selectedLength={selected.length}
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
        {!isNotFound && (
          <TablePaginationCustom
            count={machineErpLogstotalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
      </TableCard>
    </Container>
    {openLogDetailsDialog ? (
      <DialogViewMachineLogDetails
        logDetails={selectedLog}
        openLogDetailsDialog={openLogDetailsDialog}
        setOpenLogDetailsDialog={setOpenLogDetailsDialog}
        logType={selectedLogType?.type}
      />
    ) : null}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis =  inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  // (customer) => customer.name.toLowerCase().indexOf(filterName.toLowerCase()) || customer.tradingName.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.city.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.country.toLowerCase().indexOf(filterName.toLowerCase()) || customer.createdAt.toLowerCase().indexOf(filterName.toLowerCase()) !== -1

  // if (filterName) {
  //   inputData = inputData.filter(
  //     (log) => 
  //     fDateTime(log?.date)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
  //       log?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
  //       // (log?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
  //       fDateTime(log?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
  //   );
  // }
  if (filterName) {
    inputData = inputData.filter((log) => {
      const searchValue = filterName.toLowerCase();
      return Object.values(log).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchValue);
        }
        if (value && typeof value === 'object') {
          return JSON.stringify(value).toLowerCase().includes(searchValue);
        }
        return false;
      });
    });
  }

  return inputData;
}

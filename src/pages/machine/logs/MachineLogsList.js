import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef, useReducer } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// routes
import { useParams, useSearchParams } from 'react-router-dom';
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
  setFilterBy,
  resetMachineErpLogDates,
  resetMachineErpLogRecords,
} from '../../../redux/slices/products/machineErpLogs';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';
import DialogViewMachineLogDetails from '../../../components/Dialog/DialogViewMachineLogDetails';

// ----------------------------------------------------------------------

function tableColumnsReducer(state, action) {
  switch (action.type) {
    case 'setUpInitialColumns': {
      let columns = [...state]
      if (!action.allMachineLogsPage) {
        columns = columns.filter((column) => column.page !== 'allMachineLogs');
      }
      columns = columns.map((column) => ({...column, checked: column?.defaultShow || false}));
      return [...columns];
    }
    case 'updateColumnCheck': {
      const columns = [...state]
      const columnIndex = state.findIndex((columnItem) => columnItem.id === action.columnId);
      if (columnIndex !== -1) {
        columns[columnIndex].checked = action.newCheckState;
      }
      return [...columns];
    }
    // case 'handleLogTypeChange': {
    //   // eslint-disable-next-line no-debugger
    //   debugger
    //   let columns = action.newColumns
    //   if (!action.allMachineLogsPage) {
    //     columns = columns.filter((column) => column.page !== 'allMachineLogs');
    //   }
    //   return [...columns];
    // }
    default: {
      throw Error(`Unknown action:  ${action.type}`);
    }
  }
}

MachineLogsList.propTypes = {
  allMachineLogsPage: PropTypes.bool,
  allMachineLogsType: PropTypes.object
};

export default function MachineLogsList({ allMachineLogsPage = false, allMachineLogsType }){
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [openLogDetailsDialog, setOpenLogDetailsDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [archivedLogs, setArchivedLogs] = useState(false);
  const [tableColumns, dispatchTableColumns] = useReducer(tableColumnsReducer, machineLogTypeFormats[0]?.tableColumns);
  // const [localPagination, setLocalPagination] = useState({page: 0, rowsPerPage: 10})

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(ChangePage(0));
    dispatch(resetMachineErpLogDates());
    dispatch(resetMachineErpLogRecords());
    handleResetFilter();
    dispatchTableColumns({ type: 'setUpInitialColumns', allMachineLogsPage });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setArchivedLogs(searchParams.get('status') === 'archived');
  }, [searchParams])

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
  const { machine } = useSelector((state) => state.machine);

  const { machineId } = useParams();
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'date', defaultOrder: 'asc' });

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  // useEffect(() => {
  //   // eslint-disable-next-line no-debugger
  //   debugger
  //   dispatchTableColumns({
  //     type: 'handleLogTypeChange',
  //     newColumns: (allMachineLogsType || selectedLogType)?.tableColumns,
  //     allMachineLogsPage
  //   });
  // }, [allMachineLogsPage, allMachineLogsType, selectedLogType]);

  useLayoutEffect(() => {
    if (machineId && selectedLogType && !allMachineLogsPage) {
      dispatch(
        getMachineLogRecords({
          customerId: machine?.customer?._id,
          machineId,
          page,
          pageSize: rowsPerPage,
          fromDate: dateFrom,
          toDate: dateTo,
          isArchived: archivedLogs,
          isMachineArchived: false,
          selectedLogType: selectedLogType.type,
        })
      );
    }
  }, [dispatch, machineId, page, rowsPerPage, dateFrom, dateTo, selectedLogType, archivedLogs, machine, allMachineLogsPage ]);

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
    dispatch(setFilterBy(''))
    dispatch(resetMachineErpLogDates());
    setFilterName('');
    if (archivedLogs) {
      setSearchParams({ status: 'active' });
    } else {
      setSearchParams({ status: 'archived' });
    }
  };

  // const handleViewRow = async (id) => navigate(PATH_MACHINE.machines.logs.view(machineId, `${selectedLogType?.type}_${id}`));

  const handleViewRow = (id) => {
    const log = dataFiltered.find((item) => item._id === id);
    setSelectedLog({
      ...log,
      customer: log.customer?.name || '',
      machine: log.machine?.serialNo || '',
      createdBy: log.createdBy?.name || '',
      updatedBy: log.updatedBy?.name || '',
    });
    setOpenLogDetailsDialog(true);
  };
  
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const refreshLogsList = () => {
    dispatch(getMachineLogRecords({
      customerId: machine?.customer?._id,
      machineId,
      page,
      pageSize: rowsPerPage,
      fromDate: dateFrom,
      toDate: dateTo,
      isArchived: archivedLogs,
      isMachineArchived: false,
      selectedLogType: selectedLogType.type,
    }))
  }

  const handleColumnButtonClick = (columnId, newCheckState) => {
    dispatchTableColumns({ type: 'updateColumnCheck', columnId, newCheckState });
  };

  return (
    <>
      <Container maxWidth={false}>
        {!allMachineLogsPage ? <MachineTabContainer currentTabValue="logs" /> : null}
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
            allMachineLogsPage={allMachineLogsPage}
          />

          {/* {!isNotFound && !isMobile &&(
          <TablePaginationFilter
            columns={selectedLogTypeTableColumns?.map((column) => column.label)}
            // hiddenColumns={reportHiddenColumns}
            // handleHiddenColumns={handleHiddenColumns}
            count={machineErpLogstotalCount || 0}
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
              columnFilterButtonData={tableColumns}
              columnButtonClickHandler={handleColumnButtonClick}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                <TableHead>
                  <TableRow>
                    {tableColumns?.map((headCell, index) => {
                      if (!headCell?.checked) return null;
                      return (
                        <TableCell
                          key={headCell.id}
                          align='left'
                          sortDirection={orderBy === headCell.id ? order : false}
                          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
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
                      )}
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered).map((row, index) =>
                    row ? (
                      <MachineLogsTableRow
                        key={row._id}
                        columnsToShow={tableColumns}
                        allMachineLogsPage={allMachineLogsPage}
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
          allMachineLogsPage={allMachineLogsPage}
          openLogDetailsDialog={openLogDetailsDialog}
          setOpenLogDetailsDialog={setOpenLogDetailsDialog}
          logType={selectedLogType?.type}
          refreshLogsList={refreshLogsList}
        />
      ) : null}
    </>
  );
}
// ----------------------------------------------------------------------

const FilterColumnsButton = () => {

}
function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis =  inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
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

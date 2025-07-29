import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import TableCard from '../../../components/ListTableTools/TableCard';
import { 
  useTable, 
  getComparator, 
  TableNoData, 
  TableSkeleton, 
  TablePaginationFilter 
} from '../../../components/table';
import { getMachineLogRecords, ChangeRowsPerPage, ChangePage, resetMachineErpLogRecords } from '../../../redux/slices/products/machineErpLogs';
import Scrollbar from '../../../components/scrollbar';
import MachineLogsTableRow from './MachineLogsTableRow';
import DialogViewMachineLogDetails from '../../../components/Dialog/DialogViewMachineLogDetails';
import MachineLogsDataTablePaginationFilter from './MachineLogsDataTablePaginationCustom';

function tableColumnsReducer(state, action) {
  switch (action.type) {
    case 'setUpInitialColumns': {
      let columns = [...state];
      if (!action.allMachineLogsPage) {
        columns = columns.filter((column) => column.page !== 'allMachineLogs');
      }
      columns = columns.map((column) => ({ ...column, checked: column?.defaultShow || false }));
      return [...columns];
    }
    case 'updateColumnCheck': {
      const columns = [...state];
      const columnIndex = state.findIndex((columnItem) => columnItem.id === action.columnId);
      if (columnIndex !== -1) {
        columns[columnIndex].checked = action.newCheckState;
      }
      return [...columns];
    }
    case 'selectAllColumns': {
      const columns = [...state];
      if (columns.every(column => column.checked)) {
        columns.forEach((column) => {
          if (!column.alwaysShow) {
            column.checked = false;
          }
        });
        return [...columns];
      }
      columns.forEach((column) => {
        if (!column.alwaysShow) {
          column.checked = true;
        }
      });
      return [...columns];
    }
    case 'handleLogTypeChange': {
      let columns = action.newColumns;
      if (!action.allMachineLogsPage) {
        columns = columns?.filter((column) => column.page !== 'allMachineLogs');
      }
      columns = columns.map((column) => ({ ...column, checked: column?.defaultShow || false }));
      return [...columns];
    }
    default: {
      throw Error(`Unknown action:  ${action.type}`);
    }
  }
}

const MachineLogsDataTable = ({ logType, unitType, allMachineLogsPage, dataForApi }) => {
  const [openLogDetailsDialog, setOpenLogDetailsDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, dispatchTableColumns] = useReducer(tableColumnsReducer, logType?.tableColumns || []);
  const { machineErpLogs, machineErpLogstotalCount, page, rowsPerPage, isLoading } = useSelector((state) => state.machineErpLogs);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ChangePage(0));
    dispatch(resetMachineErpLogRecords());
    dispatchTableColumns({ type: 'setUpInitialColumns', allMachineLogsPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataForApi?.machineId && logType) {
      dispatch(
        getMachineLogRecords({
          ...dataForApi,
          page,
          pageSize: rowsPerPage,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    setTableData(machineErpLogs?.data || []);
  }, [machineErpLogs]);

  useEffect(() => {
    const newColumns = logType?.tableColumns;
    if (newColumns) {
      dispatchTableColumns({
        type: 'handleLogTypeChange',
        newColumns,
        allMachineLogsPage,
      });
    }
  }, [allMachineLogsPage, logType]);

  const { order, orderBy, selected, onSort } = useTable({
    defaultOrderBy: 'date',
    defaultOrder: 'desc',
  });

  const dataFiltered = applySort({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const isNotFound = !dataFiltered.length || (!isLoading && !dataFiltered.length);
  const denseHeight = 60;

  const onChangePage = (event, newPage) => {
    dispatch(ChangePage(newPage));
  };
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleViewRow = (id) => {
    const log = dataFiltered.find((item) => item._id === id);
    setSelectedLog({
      ...log,
      customer: log.customer?.name || '',
      machine: log.machine?.serialNo || '',
      createdBy: log.createdBy?.name || '',
      updatedBy: log.updatedBy?.name || '',
      ...(log.createdByIdentifier && { createdBy: log.createdByIdentifier }),
      ...(log.updatedByIdentifier && { updatedBy: log.updatedByIdentifier }),
    });
    setOpenLogDetailsDialog(true);
  };

  const refreshLogsList = () => {
    dispatch(
      getMachineLogRecords({
        ...dataForApi,
        page,
        pageSize: rowsPerPage,
      })
    );
  };

  const handleColumnButtonClick = (columnId, newCheckState) => {
    dispatchTableColumns({ type: 'updateColumnCheck', columnId, newCheckState });
  };

  const handleAllColumnSelection = () => {
    dispatchTableColumns({ type: 'selectAllColumns' });
  }

  const getFormattedLabel = (column, activeUnitSystem) => {
    const { label, baseUnit } = column;
    if (!column.convertable) return label;
    // Metric Length
    if (activeUnitSystem === 'Metric' && ['m', 'mm'].includes(baseUnit?.toLowerCase())) {
      return `${label} (${baseUnit})`;
    }
    // Imperial Length
    if (activeUnitSystem === 'Imperial' && ['m', 'mm'].includes(baseUnit?.toLowerCase())) {
      return `${label} (in)`;
    }
    // Imperial Weight
    if (activeUnitSystem === 'Imperial' && baseUnit?.toLowerCase() === 'kg') {
      return `${label} (lbs)`;
    }
    if (baseUnit?.toLowerCase() === 'msec') {
      return `${label} (s)`;
    }
    // Fallback to baseUnit or just label
    return baseUnit ? `${label} (${baseUnit})` : label;
  };

  return (
    <>
      <TableCard>
        {!isNotFound && (
          <MachineLogsDataTablePaginationFilter
            count={machineErpLogstotalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            columnFilterButtonData={tableColumns}
            columnButtonClickHandler={handleColumnButtonClick}
            allColumnsSelectHandler={handleAllColumnSelection}
            unitType={unitType}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
              <TableHead>
                <TableRow>
                  {dataFiltered.length > 0 &&
                    tableColumns?.map((headCell, index) => {
                      if (!headCell?.checked) return null;
                      return (
                        <TableCell
                          key={headCell.id}
                          align="center"
                          sortDirection={orderBy === headCell.id ? order : false}
                          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                        >
                          {!onSort && headCell.label}

                          {onSort && (
                            <TableSortLabel
                              hideSortIcon
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : 'asc'}
                              onClick={() => onSort(headCell.id)}
                              sx={{ textTransform: 'none' }}
                            >
                              <Tooltip
                                title={headCell.tooltip && headCell.fullLabel ? headCell.fullLabel : ''}
                                arrow
                                placement="top"
                                disableHoverListener={!headCell.tooltip || !headCell.fullLabel}
                              >
                                <span>{getFormattedLabel(headCell, unitType)}</span>
                              </Tooltip>
                            </TableSortLabel>
                          )}
                        </TableCell>
                      );
                    })}
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
                      unit={unitType}
                    />
                  ) : (
                    isLoading && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}
                {!isLoading && <TableNoData isNotFound={isNotFound} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        {!isNotFound && (
          <TablePaginationFilter
            count={machineErpLogstotalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
      </TableCard>
      {openLogDetailsDialog ? (
        <DialogViewMachineLogDetails
          logDetails={selectedLog}
          allMachineLogsPage={allMachineLogsPage}
          openLogDetailsDialog={openLogDetailsDialog}
          setOpenLogDetailsDialog={setOpenLogDetailsDialog}
          logType={logType?.type}
          refreshLogsList={refreshLogsList}
        />
      ) : null}
    </>
  );
};
MachineLogsDataTable.propTypes = {
  allMachineLogsPage: PropTypes.bool,
  unitType: PropTypes.string,
  logType: PropTypes.object,
  dataForApi: PropTypes.object,
};

function applySort({ inputData, comparator }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  return inputData;
}

export default MachineLogsDataTable;

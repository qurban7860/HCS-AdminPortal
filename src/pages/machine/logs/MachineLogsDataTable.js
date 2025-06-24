import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import TableCard from '../../../components/ListTableTools/TableCard';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationCustom,
} from '../../../components/table';
import {
  getMachineLogRecords,
  ChangeRowsPerPage,
  ChangePage,
  resetMachineErpLogRecords,
} from '../../../redux/slices/products/machineErpLogs';
import Scrollbar from '../../../components/scrollbar';
import MachineLogsTableRow from './MachineLogsTableRow';
import DialogViewMachineLogDetails from '../../../components/Dialog/DialogViewMachineLogDetails';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';

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

const MachineLogsDataTable = ({ logType, allMachineLogsPage, dataForApi, unit }) => {
  const [openLogDetailsDialog, setOpenLogDetailsDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, dispatchTableColumns] = useReducer(
    tableColumnsReducer,
    machineLogTypeFormats[0]?.tableColumns
  );

  const numericalLengthValues = machineLogTypeFormats[0]?.numericalLengthValues || [];
  const { machineErpLogs, machineErpLogstotalCount, page, rowsPerPage, isLoading } = useSelector(
    (state) => state.machineErpLogs
  );
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

   const convertUnit = (value, selectedUnit) => {
        if (typeof value !== 'number') return value;
        if (selectedUnit === 'in') return (value / 25.4).toFixed(2);
          return value.toFixed(2);
       };

  return (
    <>
      <TableCard>
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
                  {dataFiltered.length > 0 &&
                    tableColumns?.map((headCell, index) => {
                      if (!headCell?.checked) return null;
                      return (
                        <TableCell
                          key={headCell.id}
                          // align={headCell?.numerical ? 'right' : 'left'}
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
                          title={headCell.tooltip && headCell.tooltipText ? headCell.tooltipText : ''}
                          arrow
                          placement="top"
                          disableHoverListener={!headCell.tooltip || !headCell.tooltipText}
                           >
                          <span style={{ display: 'inline-block' }}>
                        {headCell.label}
                          </span>
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
                      numericalLengthValues={numericalLengthValues}
                      unit={unit}
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
          <TablePaginationCustom
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
  logType: PropTypes.object,
  dataForApi: PropTypes.object,
  unit: PropTypes.string,
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

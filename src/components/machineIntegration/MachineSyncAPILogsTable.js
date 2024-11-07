import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import PropTypes from 'prop-types';
import TableCard from '../ListTableTools/TableCard';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationCustom,
} from '../table';
import {
  getApiLogs,
  ChangeRowsPerPage,
  ChangePage,
  // resetApiLogs,
  // getApiLog,
} from '../../redux/slices/logs/apiLogs';
import Scrollbar from '../scrollbar';
import APILogsTableRow from './APILogsTableRow';
import Iconify from '../iconify';
import FormLabel from '../DocumentForms/FormLabel';
import { FORMLABELS } from '../../constants/document-constants';
import { StyledTooltip } from '../../theme/styles/default-styles';

const tableColumns = [
  {
    id: 'createdAt',
    label: 'Timestamp',
    width: 180,
  },
  {
    id: 'requestMethod',
    label: 'Method',
    width: 100,
  },
  {
    id: 'requestURL',
    label: 'Endpoint',
    width: 250,
  },
  {
    id: 'responseStatusCode',
    label: 'Status',
    width: 100,
  },
  {
    id: 'responseTime',
    label: 'Response Time (ms)',
    width: 120,
  },
  {
    id: 'machine',
    label: 'Machine',
    width: 150,
  },
  {
    id: 'customer',
    label: 'Customer',
    width: 150,
  },
  {
    id: 'additionalContextualInformation',
    label: 'Description',
    width: 200,
  }
];

const MachineSyncAPILogsTable = ({
  machineId,
  apiLogTableDialogState,
  setApiLogTableDialogState
}) => {
  // const [openLogDetailsDialog, setOpenLogDetailsDialog] = useState(false);
  // const [selectedLog, setSelectedLog] = useState(null);
  const [tableData, setTableData] = useState([]);

  const { apiLogs, apiLogsCount, page, rowsPerPage, isLoading } = useSelector(
    (state) => state.apiLogs
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ChangePage(0));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getApiLogs({
      machineId,
      orderBy: 'createdAt:desc',
      query: { apiType: 'MACHINE-INTEGRATION' },
      page,
      pageSize: rowsPerPage,
      }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage ]);

  useEffect(() => {
    setTableData(apiLogs?.data || [] );
  }, [apiLogs]);

  const { order, orderBy, selected, onSort } = useTable({
    defaultOrderBy: 'createdAt',
    defaultOrder: 'desc',
  });

  const dataSorted = applySort({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const isNotFound = !dataSorted.length || (!isLoading && !dataSorted.length);
  const denseHeight = 60;

  const onChangePage = (event, newPage) => {
    dispatch(ChangePage(newPage));
  };
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  // const handleViewRow = (id) => {
  //   const log = dataSorted.find((item) => item._id === id);
  //   setSelectedLog({
  //     ...log,
  //     customer: log.customer?.name || '',
  //     machine: log.machine?.serialNo || '',
  //     createdBy: log.createdBy?.name || '',
  //     updatedBy: log.updatedBy?.name || '',
  //   });
  //   setOpenLogDetailsDialog(true);
  // };

  const refreshLogsList = () => {
    dispatch(
      getApiLogs({
        machineId,
        orderBy: 'createdAt:desc',
        query: { apiType: 'MACHINE-INTEGRATION' },
        page,
        pageSize: rowsPerPage,
      })
    );
  };


  return (
    <>
      {dataSorted.length > 0 && (
        <Card sx={{ width: '100%', p: '1rem', mb: 3 }}>
          <FormLabel content={FORMLABELS.INTEGRATION.SYNC_LOGS_HISTORY} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '1rem' }}>
            <StyledTooltip
              title="Reload"
              placement="top"
              disableFocusListener
              tooltipcolor="#103996"
              color="#103996"
            >
              <IconButton
                onClick={refreshLogsList}
                color="#fff"
                sx={{
                  background: '#2065D1',
                  borderRadius: 1,
                  height: '1.7em',
                  p: '8.5px 14px',
                  '&:hover': {
                    background: '#103996',
                    color: '#fff',
                  },
                }}
              >
                <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon="mdi:reload" />
              </IconButton>
            </StyledTooltip>
          </Box>
          <TableCard>
            {!isNotFound && (
              <TablePaginationCustom
                count={apiLogsCount || 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />
            )}

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                  <TableHead>
                    <TableRow>
                      {dataSorted.length > 0 &&
                        tableColumns?.map((headCell, index) => (
                          <TableCell
                            key={headCell.id}
                            align="left"
                            sortDirection={orderBy === headCell.id ? order : false}
                            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                          >
                            {onSort ? (
                              <TableSortLabel
                                hideSortIcon
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={() => onSort(headCell.id)}
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
                    {(isLoading ? [...Array(rowsPerPage)] : dataSorted).map((row, index) =>
                      row ? (
                        <APILogsTableRow
                          row={row}
                          // onViewRow={() => handleViewRow(row._id)}
                          selected={selected.includes(row._id)}
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
                count={apiLogsCount || 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />
            )}
          </TableCard>
        </Card>
      )}
      {/* {openLogDetailsDialog ? (
        <DialogViewMachineLogDetails
          logDetails={selectedLog}
          allMachineLogsPage={allMachineLogsPage}
          openLogDetailsDialog={openLogDetailsDialog}
          setOpenLogDetailsDialog={setOpenLogDetailsDialog}
          refreshLogsList={refreshLogsList}
        />
      ) : null} */}
    </>
  );
};

MachineSyncAPILogsTable.propTypes = {
  machineId: PropTypes.string,
  apiLogTableDialogState: PropTypes.bool,
  setApiLogTableDialogState: PropTypes.func,
};

function applySort({ inputData, comparator }) {
  const stabilizedThis =  inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  return inputData;
}

export default MachineSyncAPILogsTable;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import PropTypes from 'prop-types';
import TableCard from '../ListTableTools/TableCard';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadFilter,
} from '../table';
import {
  getApiLogs,
} from '../../redux/slices/logs/apiLogs';
import Scrollbar from '../scrollbar';
import APILogsTableRow from './APILogsTableRow';
import Iconify from '../iconify';
import FormLabel from '../DocumentForms/FormLabel';
import { FORMLABELS } from '../../constants/document-constants';
import { StyledTooltip } from '../../theme/styles/default-styles';

const TABLE_HEAD = [
  { id: 'createdAt', label: 'Timestamp', align: 'left' },
  { id: 'apiType', label: 'API Type', align: 'left' },
  { id: 'requestMethod', label: 'Method', align: 'left' },
  { id: 'requestURL', label: 'Endpoint', align: 'left', allowSearch: true },
  { id: 'responseStatusCode', label: 'Status', align: 'left' },
  { id: 'responseTime', label: 'Time(ms)', align: 'left', allowSearch: true },
  { id: 'responseMessage', label: 'Response', align: 'left', allowSearch: true },
  { id: 'customer.name', label: 'Customer', align: 'left' },
  { id: 'machine', label: 'Machine', align: 'left' },
];

const MachineSyncAPILogsTable = ({
  machineId,
  apiLogTableDialogState,
  setApiLogTableDialogState
}) => {
  const [tableData, setTableData] = useState([]);

  const { apiLogs, isLoading } = useSelector(
    (state) => state.apiLogs
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApiLogs({
      machineId,
      orderBy: 'createdAt:-1',
      query: { apiType: 'MACHINE-SYNC' },
      limit: 20,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTableData(apiLogs || []);
  }, [apiLogs]);

  const { order, orderBy } = useTable({
    defaultOrderBy: 'createdAt',
    defaultOrder: 'desc',
  });

  const isNotFound = !tableData.length || (!isLoading && !tableData.length);
  const denseHeight = 60;

  const refreshLogsList = () => {
    dispatch(
      getApiLogs({
        machineId,
        orderBy: 'createdAt:-1',
        query: { apiType: 'MACHINE-SYNC' },
        limit: 20,
      })
    );
  };

  return (
    <>
      {tableData.length > 0 && (
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
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                  <TableHeadFilter
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    // onSort={onSort}
                  />
                  <TableBody>
                    {(isLoading ? [...Array(10)] : tableData).map((row, index) =>
                      row ? (
                        <APILogsTableRow
                          key={index}
                          row={row}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                          tableColumns={TABLE_HEAD}
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
          </TableCard>
        </Card>
      )}
    </>
  );
};

MachineSyncAPILogsTable.propTypes = {
  machineId: PropTypes.string,
  apiLogTableDialogState: PropTypes.bool,
  setApiLogTableDialogState: PropTypes.func,
};

export default MachineSyncAPILogsTable;

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Divider, 
  Typography, 
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Box,
  DialogActions,
  Button,
} from '@mui/material';
import { getMachineLogsByIds } from '../../redux/slices/products/machineErpLogs';
import { fDateTime } from '../../utils/formatTime';
import Scrollbar from '../scrollbar';
import { TableNoData, TableSkeleton } from '../table';
import { StyledTableRow } from '../../theme/styles/default-styles';
import CodeMirror from '../CodeMirror/JsonEditor';

DialogViewAPILogsMachineERPLogsTable.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  logIds: PropTypes.array,
  logType: PropTypes.string,
};

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'machineSerialNo', label: 'Machine', align: 'left' },
  { id: 'componentLabel', label: 'Component Label', align: 'left' },
  { id: 'frameSet', label: 'Frame Set', align: 'left' },
  { id: 'componentLength', label: 'Component Length', align: 'right' },
  { id: 'waste', label: 'Waste', align: 'right' },
  { id: 'coilLength', label: 'Coil Length', align: 'right' },
  { id: 'flangeHeight', label: 'Flange Height', align: 'right' },
  { id: 'webWidth', label: 'Web Width', align: 'right' },
  { id: 'profileShape', label: 'Profile Shape', align: 'left' },
];

const NUMERICAL_VALUES = [
  'componentLength',
  'waste',
  'coilLength',
  'flangeHeight',
  'webWidth',
];

const formatCellValue = (columnId, row) => {
  if (columnId === 'date') {
    return fDateTime(row?.date);
  }
  if (columnId === 'machineSerialNo') {
    return row?.machine?.serialNo;
  }
  if (NUMERICAL_VALUES.includes(columnId)) {
    return (row[columnId] / 1000).toFixed(3);
  }
  return row[columnId] || '';
};

const formatMachineLogToShow = (log) => {
  const {
    // Main data
    _id,
    date,
    componentLabel,
    frameSet,
    componentLength,
    waste,
    coilLength,
    flangeHeight,
    time,
    webWidth,
    profileShape,
    ccThickness,
    coilBatchName,
    operator,
    // Machine info
    machine,
    // Metadata
    customer,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
    createdIP,
    updatedIP,
    // Status
    isActive,
    isArchived,
    archivedByMachine,
    // Other
    batchId,
    apiLogId,
    // Remove unnecessary fields
    __v,
    type,
    version,
    createdByIdentifier,
    updatedByIdentifier,
    ...rest
  } = log;

  return {
    mainData: {
      date: fDateTime(date),
      componentLabel,
      frameSet,
      componentLength: componentLength || null,
      waste: waste || null,
      coilLength: coilLength || null,
      time: time || null,
      flangeHeight: flangeHeight || null,
      webWidth: webWidth || null,
      ccThickness: ccThickness || null,
      profileShape,
      coilBatchName: coilBatchName || null,
      operator: operator || null,
    },
    metadata: {
      customer,
      machine: machine ? { ...machine, portalKey: undefined } : {},
      createdBy,
      createdAt: fDateTime(createdAt),
      updatedBy,
      updatedAt: fDateTime(updatedAt),
      createdIP,
      updatedIP,
    },
    status: {
      isActive,
      isArchived,
      archivedByMachine,
    },
    identifiers: {
      id: _id,
      batchId,
      apiLogId,
    },
    ...rest
  };
};

const ExpandedRowDetails = ({ row }) => {
  const logsToShow = formatMachineLogToShow(row);

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.neutral' }}>
      <CodeMirror
        value={JSON.stringify(logsToShow, null, 2)}
        HandleChangeIniJson={() => {}}
        editable={false}
        disableTopBar
        autoHeight
      />
    </Box>
  );
};

ExpandedRowDetails.propTypes = {
  row: PropTypes.object,
};

export default function DialogViewAPILogsMachineERPLogsTable({ open, onClose, logIds, logType }) {
  const dispatch = useDispatch();
  const { machineErpLogs, isLoading } = useSelector((state) => state.machineErpLogs);
  const [tableData, setTableData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    if (open && logIds?.length) {
      dispatch(getMachineLogsByIds(logIds, logType));
    }
  }, [dispatch, logIds, logType, open]);

  useEffect(() => {
    if (machineErpLogs) {
      setTableData(machineErpLogs);
    }
  }, [machineErpLogs]);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const isNotFound = !tableData.length || (!isLoading && !tableData.length);
  const denseHeight = 60;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Machine Logs ({logIds?.length || 0} Records)
          </Typography>
        </Stack>
      </DialogTitle>
      <Divider orientation="horizontal" flexItem sx={{ mb: 2 }} />
      <DialogContent>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD?.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.align}
                      sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                      title="Click to show details"
                    >
                      {NUMERICAL_VALUES.includes(headCell.id) ? `${headCell.label} (m)` : headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(isLoading ? [...Array(10)] : tableData)?.map((row, index) =>
                  row ? (
                    <>
                      <StyledTableRow 
                        hover 
                        key={row._id || index}
                        onClick={() => handleRowClick(row._id)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        {TABLE_HEAD?.map((column) => (
                          <TableCell key={column.id} align={column.align}>
                            {formatCellValue(column.id, row)}
                          </TableCell>
                        ))}
                      </StyledTableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={TABLE_HEAD.length}>
                          <Collapse in={expandedRow === row._id} timeout="auto" unmountOnExit>
                            <ExpandedRowDetails row={row} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}
                {!isLoading && <TableNoData isNotFound={isNotFound} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 
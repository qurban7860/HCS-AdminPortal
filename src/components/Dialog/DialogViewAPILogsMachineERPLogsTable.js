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
import { getMachineLogsByApiId } from '../../redux/slices/products/machineErpLogs';
import { fDateTime } from '../../utils/formatTime';
import Scrollbar from '../scrollbar';
import { TableNoData, TableSkeleton } from '../table';
import { StyledTableRow } from '../../theme/styles/default-styles';
import CodeMirror from '../CodeMirror/JsonEditor';
import { convertMmToM } from '../Utils/measurementHelpers';
// Constants and configurations
const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'machineSerialNo', label: 'Machine', align: 'left' },
  { id: 'componentLabel', label: 'Component Label', align: 'left' },
  { id: 'frameSet', label: 'Frame Set', align: 'left' },
  { id: 'componentLength', label: 'Component Length', align: 'right' },
  { id: 'waste', label: 'Waste', align: 'right' },
  { id: 'coilLength', label: 'Coil Length', align: 'right' },
  { id: 'time', label: 'Time', align: 'left' },
  { id: 'componentGUID', label: 'Component GUID', align: 'left' },
];

const NUMERICAL_VALUES = [
  'componentLength',
  'waste',
  'coilLength',
  'flangeHeight',
  'webWidth',
];

// Helper functions
const formatCellValue = (columnId, row) => {
  if (columnId === 'date') return fDateTime(row?.date);
  if (columnId === 'machineSerialNo') return row?.machine?.serialNo;
  if (NUMERICAL_VALUES.includes(columnId)) return convertMmToM(row[columnId]);
  return row[columnId] || '';
};

const formatMachineLogToShow = (log) => {
  const {
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
    machine,
    customer,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
    createdIP,
    updatedIP,
    isActive,
    isArchived,
    archivedByMachine,
    batchId,
    apiLogId,
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
      ...rest,
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
  };
};

// Sub-components
const TableHeader = () => (
  <TableHead>
    <TableRow>
      {TABLE_HEAD.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align}
          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
        >
          {NUMERICAL_VALUES.includes(headCell.id) ? `${headCell.label} (m)` : headCell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const ExpandedRowDetails = ({ row }) => (
  <Box sx={{ p: 3, backgroundColor: 'background.neutral' }}>
    <CodeMirror
      value={JSON.stringify(formatMachineLogToShow(row), null, 2)}
      HandleChangeIniJson={() => {}}
      editable={false}
      disableTopBar
      autoHeight
    />
  </Box>
);

ExpandedRowDetails.propTypes = {
  row: PropTypes.object,
};

const DataRow = ({ row, index, expandedRow, onRowClick }) => (
  <>
    <StyledTableRow
      hover
      key={row._id || index}
      onClick={() => onRowClick(row._id)}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      {TABLE_HEAD.map((column) => (
        <TableCell key={column.id} align={column.align}>
          {formatCellValue(column.id, row)}
        </TableCell>
      ))}
    </StyledTableRow>
    <TableRow title="Click to show details">
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={TABLE_HEAD.length}>
        <Collapse in={expandedRow === row._id} timeout="auto" unmountOnExit>
          <ExpandedRowDetails row={row} />
        </Collapse>
      </TableCell>
    </TableRow>
  </>
);

DataRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  expandedRow: PropTypes.string,
  onRowClick: PropTypes.func,
};

const TableContent = ({ isLoading, tableData, expandedRow, onRowClick, denseHeight }) => {
  if (isLoading) {
    return [...Array(10)].map((_, index) => (
      <TableSkeleton key={index} sx={{ height: denseHeight }} />
    ));
  }

  return tableData.map((row, index) => (
    row ? (
      <DataRow
        key={row._id || index}
        row={row}
        index={index}
        expandedRow={expandedRow}
        onRowClick={onRowClick}
      />
    ) : (
      <TableSkeleton key={index} sx={{ height: denseHeight }} />
    )
  ));
};

TableContent.propTypes = {
  isLoading: PropTypes.bool,
  tableData: PropTypes.array,
  expandedRow: PropTypes.string,
  onRowClick: PropTypes.func,
  denseHeight: PropTypes.number,
};

// Main component
export default function DialogViewAPILogsMachineERPLogsTable({ open, onClose, apiId, logType }) {
  const dispatch = useDispatch();
  const { machineErpLogs, isLoading } = useSelector((state) => state.machineErpLogs);
  const [tableData, setTableData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const denseHeight = 60;

  useEffect(() => {
    if (open && apiId) {
      dispatch(getMachineLogsByApiId(apiId, logType));
    }
  }, [dispatch, apiId, logType, open]);

  useEffect(() => {
    if (machineErpLogs) {
      setTableData(Array.isArray(machineErpLogs) ? machineErpLogs : []);
    }
  }, [machineErpLogs]);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const isNotFound = !tableData.length || (!isLoading && !tableData.length);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Machine Logs ({tableData?.length || 0} Records)
          </Typography>
        </Stack>
      </DialogTitle>
      <Divider orientation="horizontal" flexItem sx={{ mb: 2 }} />
      <DialogContent>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
              <TableHeader />
              <TableBody>
                <TableContent
                  isLoading={isLoading}
                  tableData={tableData}
                  expandedRow={expandedRow}
                  onRowClick={handleRowClick}
                  denseHeight={denseHeight}
                />
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

DialogViewAPILogsMachineERPLogsTable.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  apiId: PropTypes.string,
  logType: PropTypes.string,
}; 
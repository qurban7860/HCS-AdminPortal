import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
  Typography,
  useTheme,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import { getMachineLogRecords } from '../../redux/slices/products/machineErpLogs';
import { convertValue } from '../../utils/convertUnits';
import Iconify from '../iconify';
import { machineLogTypeFormats } from '../../constants/machineLogTypeFormats';
import { StyledContainedIconButton, StyledTooltip } from '../../theme/styles/default-styles';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const DownloadMachineLogsIconButton = ({ dataForApi, unit }) => {
  const [openLogsDownloadDialog, setOpenLogsDownloadDialog] = useState(false);
  const [dataForDownload, setDataForDownload] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const openDownloadDialog = async () => {
    setIsLoading(true);
    try {
      const logsData = await dispatch(
        getMachineLogRecords({
          ...dataForApi,
          page: undefined,
          pageSize: undefined,
          returnResponse: true,
        })
      );
      if (logsData?.length > 0) {
        setOpenLogsDownloadDialog(true);
        setDataForDownload(logsData);
      } else {
        enqueueSnackbar('No logs data available for download with the selected filters', {
          variant: `error`,
        });
      }
    } catch (error) {
      console.error('Error fetching log data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = format => {
    if (!Array.isArray(dataForDownload) || dataForDownload.length === 0) return

    const headers = ["logId", ...machineLogTypeFormats[0].formats['v1.5.X']];
    const tableColumns = machineLogTypeFormats[0]?.tableColumns;

    let blob
    let filename

    if (format === 'csv') {
      const csvRows = [headers.join(',')]

      dataForDownload.forEach(row => {
        const values = headers.map(header => {
          let value = ''
          if (row[header]) {
            value = row[header]
          }
          const columnVal = tableColumns?.find(c => c?.id === header);
          if (columnVal?.baseUnit && !Number.isNaN(parseFloat(value))) {
            const converted = convertValue(
              parseFloat(value),
              columnVal?.baseUnit,
              unit,
              false
            );
            value = converted.convertedValue;
          }
          if (header === 'timestamp') {
            value = row.timestamp || row.date
          }
          if (header === 'measurementUnit') {
            value = unit === 'Imperial' ? 'in' : 'mm';
          }
          if (header === 'logId') {
            value = row._id
          }
          const escaped = String(value).replace(/"/g, '""')
          return escaped
        })
        csvRows.push(values.join(','))
      })

      const csvString = csvRows.join('\n')
      blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
      filename = 'csv_logs.csv'
    } else if (format === 'json') {
      const jsonArray = dataForDownload.map(row => {
        const jsonObj = {}
        headers.forEach(header => {
          let value = ''
          if (row[header]) {
            value = row[header]
          }
          const columnVal = tableColumns?.find(c => c?.id === header);
          if (columnVal?.baseUnit && !Number.isNaN(parseFloat(value))) {
            const converted = convertValue(
              parseFloat(value),
              columnVal?.baseUnit,
              unit,
              false
            );
            value = converted.convertedValue;
          }
          if (header === 'timestamp') {
            value = row.timestamp || row.date
          }
          if (header === 'measurementUnit') {
            value = unit === 'Imperial' ? 'in' : 'mm';
          }
          if (header === 'logId') {
            value = row._id
          }
          jsonObj[header] = value
        })
        return jsonObj
      })

      const jsonString = JSON.stringify(jsonArray, null, 2)
      blob = new Blob([jsonString], { type: 'application/json' })
      filename = 'json_logs.json'
    }

    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setOpenLogsDownloadDialog(false)
  }

  const handleDownloadCSV = () => handleDownload('csv');
  const handleDownloadJSON = () => handleDownload('json');

  return (
    <>
      <StyledTooltip
        title="Download Logs"
        placement="top"
        disableFocusListener
        tooltipcolor={theme.palette.primary.main}
      >
        <StyledContainedIconButton disabled={isLoading} onClick={openDownloadDialog} sx={{ px: 2 }}>
          <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:tray-download" />
        </StyledContainedIconButton>
      </StyledTooltip>
      <Dialog
        open={openLogsDownloadDialog}
        TransitionComponent={Transition}
        onClose={() => setOpenLogsDownloadDialog(false)}
      >
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Typography variant="subtitle" gutterBottom>
            Download Format
          </Typography>
        </DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent sx={{ p: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleDownloadCSV}
              sx={{
                width: '150px',
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Iconify icon="mdi:file-delimited" width={40} height={40} />
              CSV Format
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleDownloadJSON}
              sx={{
                width: '150px',
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Iconify icon="mdi:code-json" width={40} height={40} />
              JSON Format
            </Button>
          </Box>
        </DialogContent>
        <Divider orientation="horizontal" flexItem />
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenLogsDownloadDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DownloadMachineLogsIconButton;
DownloadMachineLogsIconButton.propTypes = {
  dataForApi: PropTypes.object,
  unit: PropTypes.string,
};

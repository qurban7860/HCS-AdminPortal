import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';

import { getMachineLogRecords } from '../../redux/slices/products/machineErpLogs';
import Iconify from '../iconify';
import { machineLogTypeFormats } from '../../constants/machineLogTypeFormats';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const DownloadMachineLogsDialog = ({
  openLogsDownloadDialog,
  setOpenLogsDownloadDialog,
  dataForApi,
}) => {
  const [dataForDownload, setDataForDownload] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (openLogsDownloadDialog) {
      const fetchData = async () => {
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
          setDataForDownload(logsData);
        } catch (error) {
          console.error('Error fetching log data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openLogsDownloadDialog]);

  const handleDownload = (format) => {
    if (!Array.isArray(dataForDownload) || dataForDownload.length === 0) return;

    const headers = machineLogTypeFormats[0]?.formats?.['v1.5.X'];
    let blob;
    let filename;

    if (format === 'csv') {
      const csvRows = [headers.join(',')];

      dataForDownload.forEach((row) => {
        const values = headers.map((header) => {
          let value = row[header] !== undefined ? row[header] : '';
          if (header === 'timestamp') value = row.timestamp || row.date;
          if (header === 'measurementUnit') value = 'mm';
          const escaped = String(value).replace(/"/g, '""');
          return escaped;
        });
        csvRows.push(values.join(','));
      });

      const csvString = csvRows.join('\n');
      blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      filename = 'csv_logs.csv';
    } else if (format === 'json') {
      const jsonArray = dataForDownload.map((row) => {
        const jsonObj = {};
        headers.forEach((header) => {
          let value = row[header] !== undefined ? row[header] : '';
          if (header === 'timestamp') value = row.timestamp || row.date;
          if (header === 'measurementUnit') value = 'mm';
          jsonObj[header] = value;
        });
        return jsonObj;
      });

      const jsonString = JSON.stringify(jsonArray, null, 2);
      blob = new Blob([jsonString], { type: 'application/json' });
      filename = 'json_logs.json';
    }

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setOpenLogsDownloadDialog(false);
  };

  const handleDownloadCSV = () => handleDownload('csv');
  const handleDownloadJSON = () => handleDownload('json');

  return (
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
          <LoadingButton
            variant="outlined"
            size="large"
            onClick={handleDownloadCSV}
            loading={isLoading}
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
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            size="large"
            onClick={handleDownloadJSON}
            loading={isLoading}
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
          </LoadingButton>
        </Box>
      </DialogContent>
      <Divider orientation="horizontal" flexItem />
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpenLogsDownloadDialog(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DownloadMachineLogsDialog;
DownloadMachineLogsDialog.propTypes = {
  openLogsDownloadDialog: PropTypes.bool,
  setOpenLogsDownloadDialog: PropTypes.func,
  dataForApi: PropTypes.object,
};

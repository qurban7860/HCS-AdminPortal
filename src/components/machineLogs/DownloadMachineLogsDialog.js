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
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';

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
  const dispatch = useDispatch();

  useEffect(() => {
    if (openLogsDownloadDialog) {
      const fetchData = async () => {
        const logsData = await dispatch(
          getMachineLogRecords({
            ...dataForApi,
            page: undefined,
            pageSize: undefined,
            returnResponse: true,
          })
        );
        setDataForDownload(logsData);
      };
      
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openLogsDownloadDialog]);

  // const handleDownloadCSV = () => {
  //   if (!Array.isArray(dataForDownload) || dataForDownload.length === 0) return;
  //   const headersForCsv = machineLogTypeFormats[0]?.formats?.['v1.5.X'];
  //   const csvRows = [headersForCsv.join(',')];

  //   dataForDownload.forEach((row) => {
  //     const values = headersForCsv.map((header) => {
  //       let value = row[header] !== undefined ? row[header] : '';
  //       if (header === 'timestamp') value = row.timestamp || row.date;
  //       if (header === 'measurementUnit') value = 'mm';
  //       const escaped = String(value).replace(/"/g, '""');
  //       return escaped;
  //     });
  //     csvRows.push(values.join(','));
  //   });
  //   const csvString = csvRows.join('\n');
  //   const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  //   const link = document.createElement('a');

  //   const url = URL.createObjectURL(blob);

  //   link.setAttribute('href', url);
  //   link.setAttribute('download', 'csv_logs');
  //   link.style.visibility = 'hidden';

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  // const handleDownloadJSON = () => {
  //   if (!Array.isArray(dataForDownload) || dataForDownload.length === 0) return;
  //   const headersForJSON = machineLogTypeFormats[0]?.formats?.['v1.5.X'];
  //   const jsonArray = []
  //   dataForDownload.forEach((row) => {
  //     const jsonObj = {}
  //     headersForJSON.forEach((header) => {
  //       let value = row[header] !== undefined ? row[header] : '';
  //       if (header === 'timestamp') value = row.timestamp || row.date;
  //       if (header === 'measurementUnit') value = 'mm';
  //       jsonObj[header] = value;
  //     });
  //     jsonArray.push(jsonObj);
  //   });

  //   const jsonString = JSON.stringify(jsonArray, null, 2);
  //   const blob = new Blob([jsonString], { type: 'application/json' });
  //   const link = document.createElement('a');
  //   const url = URL.createObjectURL(blob);

  //   link.setAttribute('href', url);
  //   link.setAttribute('download', 'json_logs.json');
  //   link.style.visibility = 'hidden';

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // }
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

    setOpenLogsDownloadDialog(false)
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
  );
};
export default DownloadMachineLogsDialog;
DownloadMachineLogsDialog.propTypes = {
  openLogsDownloadDialog: PropTypes.bool,
  setOpenLogsDownloadDialog: PropTypes.func,
  dataForApi: PropTypes.object,
};

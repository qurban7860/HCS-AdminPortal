import PropTypes from 'prop-types';
import { useMemo, useState, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import download from 'downloadjs';
// @mui
import Image from 'mui-image';
// eslint-disable-next-line import/no-anonymous-default-export
import { Switch, Card, Grid, Stack, Typography, Button ,Box, CardMedia, Dialog, Link} from '@mui/material';
// redux
import { getDocumentDownload } from '../../redux/slices/document/downloadDocument';
// paths
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import LoadingScreen from '../../components/loading-screen';
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------
DownloadDocument.propTypes = {
  currentCustomerDocument: PropTypes.object,
};

export default function DownloadDocument({ currentCustomerDocument = null }) {
//   const Loadable = (Component) => (props) =>
//   (
//     <Suspense fallback={<LoadingScreen />}>
//       <Component {...props} />
//     </Suspense>
//   );

  const regEx = /^[^2]*/;
  const { customerDocument } = useSelector((state) => state.customerDocument);
  console.log("currentCustomerDocument : ",currentCustomerDocument)
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const downloadBase64File = (base64Data, fileName) => {
        // Decode the Base64 file
    const decodedString = atob(base64Data);
    // Convert the decoded string to a Uint8Array
    const byteNumbers = new Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i +=1) {
      byteNumbers[i] = decodedString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    // Create a Blob object from the Uint8Array
    const blob = new Blob([byteArray]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.target = '_blank';
    link.click();
  }

    const handleDownload = () => {
        // import('./DownloadComponent').then((module) => {
        //     const DownloadComponent = module.default;
        //     // Render the DownloadComponent
        //   });
      try {
        const res = dispatch(getDocumentDownload(currentCustomerDocument._id));
        console.log("res : ", res);
        if (regEx.test(res.status)) {
          download(atob(res.data), `${currentCustomerDocument?.displayName}.${currentCustomerDocument?.extension}`, { type: currentCustomerDocument?.type});
        //   downloadBase64File(res.data, `${currentCustomerDocument?.displayName}.${currentCustomerDocument?.extension}`);
          enqueueSnackbar(res.statusText);
        } else {
          enqueueSnackbar(res.statusText, { variant: 'error' });
        }
      } catch (err) {
        if (err.message) {
          enqueueSnackbar(err.message, { variant: 'error' });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
        }
      }
    };

  return (
    <>
        <Button variant="contained" color="secondary" sx={{ m:2}} startIcon={<Iconify icon="line-md:download-loop" />} onClick={handleDownload}> Download</Button>
    </>
  );
}

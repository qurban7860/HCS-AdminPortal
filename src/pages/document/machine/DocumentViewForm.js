// eslint-disable-next-line import/no-anonymous-default-export
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Link, Tooltip } from '@mui/material';
// redux
import {
  setMachineDocumentEditFormVisibility,
  deleteMachineDocument,
  getMachineDocuments,
  getMachineDocument,
  updateMachineDocument,
  resetMachineDocument,
  getMachineDocumentHistory,
} from '../../../redux/slices/document/machineDocument';
// paths
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// components
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import { getCustomer, resetCustomer } from '../../../redux/slices/customer/customer';
import { useSnackbar } from '../../../components/snackbar';
import LoadingScreen from '../../../components/loading-screen';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
const DownloadComponent = Loadable(lazy(() => import('../DownloadDocument')));

// ----------------------------------------------------------------------

export default function DocumentViewForm({ currentMachineDocument = null }) {
  const regEx = /^[^2]*/;
  const { machineDocument } = useSelector((state) => state.machineDocument);
  const { machine, machines } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const [ disableDeleteButton, setDisableDeleteButton ] = useState(false);
  const [ disableEditButton, setDisableEditButton ] = useState(false);

  useLayoutEffect(() => {
    if (machine.transferredMachine) {
      setDisableDeleteButton(true);
      setDisableEditButton(true);
    } else {
      setDisableDeleteButton(false);
      setDisableEditButton(false);
    }
  }, [machine]);
  
  // console.log(machineDocument)
  // console.log("currentMachineDocument", currentMachineDocument)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineDocument(currentMachineDocument._id));
      dispatch(getMachineDocuments(machine._id));
      enqueueSnackbar('Document deleted Successfully!');
    } catch (err) {
      enqueueSnackbar('Document delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    await dispatch(getMachineDocument(currentMachineDocument._id));

    dispatch(setMachineDocumentEditFormVisibility(true));
  };
  const linkMachineDocumentView = async () => {
    navigate(PATH_DOCUMENT.document.machine(currentMachineDocument._id));
    dispatch(resetMachineDocument());
    dispatch(resetCustomer());
    //  dispatch(resetMachine())
    await dispatch(getMachineDocumentHistory(currentMachineDocument._id));
    //  await dispatch(getMachine(currentMachineDocument.machine._id))
    await dispatch(getCustomer(currentMachineDocument.customer._id));
  };

  const defaultValues = useMemo(
    () => ({
      displayName: currentMachineDocument?.displayName || '',
      documentName: currentMachineDocument?.documentName?.name || '',
      docCategory: currentMachineDocument?.docCategory?.name || '',
      docType: currentMachineDocument?.docType?.name || '',
      customer: currentMachineDocument?.customer?.name,
      customerAccess: currentMachineDocument?.customerAccess,
      isActiveVersion: currentMachineDocument?.isActiveVersion,
      documentVersion: currentMachineDocument?.documentVersions[0]?.versionNo || '',
      versionPrefix: currentMachineDocument?.versionPrefix || '',
      description: currentMachineDocument?.description,
      isActive: currentMachineDocument?.isActive,
      createdAt: currentMachineDocument?.createdAt || '',
      createdByFullName: currentMachineDocument?.createdBy?.name || '',
      createdIP: currentMachineDocument?.createdIP || '',
      updatedAt: currentMachineDocument?.updatedAt || '',
      updatedByFullName: currentMachineDocument?.updatedBy?.name || '',
      updatedIP: currentMachineDocument?.updatedIP || '',
    }),

    [currentMachineDocument]
  );
  const callAfterDelete = () => {
    dispatch(getMachineDocuments(machine._id));
  }
  return (
    <Grid sx={{ mt: -2 }}>
      <ViewFormEditDeleteButtons
        disableEditButton={disableEditButton}
        disableDeleteButton={disableDeleteButton} 
        handleEdit={handleEdit} 
        onDelete={onDelete} 
      />
      <Grid sm={12} display="flex">
        <Tooltip>
          <ViewFormField isActive={defaultValues.isActive} />
        </Tooltip>
        <Tooltip>
          <ViewFormField customerAccess={defaultValues?.customerAccess} />
        </Tooltip>
      </Grid>
      <Grid container>
        <ViewFormField sm={6} heading="Name" param={defaultValues?.displayName} />
        {/* <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} /> */}
        <ViewFormField
          sm={6}
          heading="Version"
          objectParam={
            defaultValues.documentVersion && (
              <Typography display="flex">
                {defaultValues.versionPrefix} {defaultValues.documentVersion}
                {currentMachineDocument?.documentVersions &&
                  currentMachineDocument?.documentVersions?.length > 1 && (
                    <Link onClick={linkMachineDocumentView} href="#" underline="none">
                      <Typography variant="body2" sx={{ mt: 0.45, ml: 1 }}>
                        More version
                      </Typography>
                    </Link>
                  )}
              </Typography>
            )
          }
        />
        <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
        <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
        <Grid item sx={{ display: 'flex-inline' }}>
          <Grid container justifyContent="flex-start" gap={1}>
            {currentMachineDocument?.documentVersions[0]?.files?.map((file) => (
              <Thumbnail
                key={file._id}
                file={file}
                currentDocument={currentMachineDocument}
                customer={machine}
                hideDelete={machine.transferredMachine}
                getCallAfterDelete={callAfterDelete}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
DocumentViewForm.propTypes = {
  currentMachineDocument: PropTypes.object,
};

// ----------------------------------------------------------------------

// unused code, delete if not needed

// const downloadBase64File = (base64Data, fileName) => {
//   // Decode the Base64 file
//   const decodedString = atob(base64Data);
//   // Convert the decoded string to a Uint8Array
//   const byteNumbers = new Array(decodedString.length);
//   for (let i = 0; i < decodedString.length; i += 1) {
//     byteNumbers[i] = decodedString.charCodeAt(i);
//   }
//   const byteArray = new Uint8Array(byteNumbers);
//   // Create a Blob object from the Uint8Array
//   const blob = new Blob([byteArray]);
//   const link = document.createElement('a');
//   link.href = window.URL.createObjectURL(blob);
//   link.download = fileName;
//   link.target = '_blank';
//   link.click();
// };

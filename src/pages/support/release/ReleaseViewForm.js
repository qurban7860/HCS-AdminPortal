import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_SUPPORT } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { deleteRelease, resetRelease } from '../../../redux/slices/support/release/release';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../utils/errorHandler';
import Editor from '../../../components/editor';

// ----------------------------------------------------------------------

export default function ReleaseViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { release, isLoading } = useSelector((state) => state.release);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      releaseNo: release?.releaseNo || '',
      name: release?.name || '',
      project: release?.project,
      description: release?.description || '',
      isActive: release?.isActive,
      createdByFullName: release?.createdBy?.name || '',
      createdAt: release?.createdAt || '',
      createdIP: release?.createdIP || '',
      updatedByFullName: release?.updatedBy?.name || '',
      updatedAt: release?.updatedAt || '',
      updatedIP: release?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ release]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteRelease(id, true));
      navigate(PATH_SUPPORT.releases.root);
      enqueueSnackbar('Release Archived Successfully!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Release Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.releases.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetRelease());
          navigate(PATH_SUPPORT.releases.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading}
          sm={4}
          heading="Release No."
          param={defaultValues?.releaseNo?.toString()}
        />
        <ViewFormField isLoading={isLoading} sm={4} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={4} heading="Project" param={defaultValues.project?.name || ''} />

        <ViewFormField isLoading={isLoading} sm={12} 
          heading="Description" 
          node={<Editor readOnly hideToolbar sx={{ border: 'none', '& .ql-editor': { padding: '0px' } }} value={defaultValues.description} />}
        />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  </Grid>
  );
}

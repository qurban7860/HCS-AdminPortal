import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useCallback  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid,Container, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
// import { getSPContacts } from '../../redux/slices/contact';
import { saveMachine } from '../../redux/slices/products/machine';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../components/hook-form';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// asset
import { countries } from '../../assets/data';
// util
import MachineDashboardNavbar from './util/MachineDashboardNavbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

import { useSettingsContext } from '../../components/settings';


// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

const CONTACT_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
];

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {

  const MACHINE_TOOLS = [
    { value: 'technical', label: 'Technical' },
    { value: 'financial', label: 'Financial' },
    { value: 'support', label: 'Support' },
  ];

  const { userId, user } = useAuthContext();

  const { spContacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required')  ,
    desc: Yup.string(),
    serialNo: Yup.string(),
    parentMachine: Yup.string(),
    pseriolNo: Yup.string(),
    status: Yup.string(),
    supplier: Yup.string(),
    model: Yup.string(),
    workOrder: Yup.string(),
    instalationSite: Yup.string(),
    billingSite: Yup.string(),
    operators: Yup.string(),
    accountManager: Yup.string(),
    projectManager: Yup.string(),
    supportManager: Yup.string(),
    license: Yup.string(),
    image: Yup.mixed().nullable(true),
    tools: Yup.array(),
    itags: Yup.string(),
    ctags: Yup.string(),

  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
    desc: '',
    serialNo: '',
    parentMachine: '',
    pseriolNo: '',
    status: '',
    supplier: '',
    model: '',
    workOrder: '',
    instalationSite: '',
    billingSite: '',
    operators: '',
    accountManager: '',
    projectManager: '',
    supportManager: '',
    license: '',
    image: null,
    tools: [],
    itags: '',
    ctags: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useLayoutEffect(() => {
    // dispatch(getSPContacts());
  }, [dispatch]);


  const onSubmit = async (data) => {
    console.log(data);
      try{
        await dispatch(saveMachine(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_DASHBOARD.customer.view(null));
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const handleRemoveFile = () => {
    setValue('image', null);
  };

  const { themeStretch } = useSettingsContext();

  return (
    <>
     <Container maxWidth={themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <MachineDashboardNavbar/>
      </Grid>
      <CustomBreadcrumbs
            heading="Machine List"
            sx={{ mb: -2, mt: 3 }}
          />
        {/* <Grid item xs={18} md={12} sx={{mt: 3}}>        
        </Grid> */}
        <Card sx={{mt: 3 }}>
          {/* <CustomerListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row._id)
                  //   )
                  // }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <CustomerListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          // onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          /> */}
        </Card>
    </Container>
    </>
  );
}

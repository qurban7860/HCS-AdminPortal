import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import {Cover} from '../components/Cover';
import { useTable, getComparator, TableNoData, TableHeadCustom, TableSelectedAction, TablePaginationCustom, } from '../../components/table';
// sections
import UserTableToolbar from './SecurityUserTableToolbar';
import  UserTableRow  from './SecurityUserTableRow';
import { getSecurityUsers, deleteSecurityUser , setSecurityUserEditFormVisibility } from '../../redux/slices/securityUser/securityUser';
import { fDate } from '../../utils/formatTime';
// ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
  'Administrator',
  'Normal User',
  'Guest User',
  'Restriced User',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone Number', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  // { id: 'isVerified', label: 'Verified', align: 'center' },
  // { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
  // { id: '' },
];

// ----------------------------------------------------------------------

export default function SecurityUserList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const dispatch = useDispatch();

  const { securityUsers, error, responseMessage, initial,securityUserEditFormVisibility,securityUserFormVisibility} = useSelector((state) => state.user);
// console.log("securityUsers", securityUsers);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  useLayoutEffect(() => {
    dispatch(getSecurityUsers());
  }, [dispatch,securityUserEditFormVisibility,securityUserFormVisibility]);

  useEffect(() => {
    if (initial) {
    //   if (users && !error) {
    //     enqueueSnackbar(responseMessage);
    //   } 
      // if(error) {
      //   enqueueSnackbar(error, { variant: `error` });
      // }
      setTableData(securityUsers);
    }
  }, [securityUsers, error, enqueueSnackbar, responseMessage, initial]);


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      try {
        dispatch(deleteSecurityUser(id));
        dispatch(getSecurityUsers());
        setSelected([]);
  
        if (page > 0) {
          if (dataInPage.length < 2) {
            setPage(page - 1);
          }
        }
      } catch (err) {
        console.log(err);
      }

      
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    // console.log('id', id);
    // console.log('edit');
    dispatch(setSecurityUserEditFormVisibility(true))
    navigate(PATH_DASHBOARD.user.edit(id));
  };
  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.user.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  return (
    <>
      <Container maxWidth={false }>
        {/* <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New User
            </Button>
          }
        /> */}
        <Card sx={{ mb: 3, height: 160, position: 'relative', }} >
          <Cover name='Users' icon="ph:users-light"/>
        </Card>
        <Card>
          {/* <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider /> */}

          <UserTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              // onSelectAllRows={(checked) =>
              //   onSelectAllRows(
              //     checked,
              //     tableData.map((row) => row._id)
              //   )
              // }
              // action={
              //   <Tooltip title="Delete">
              //     <IconButton color="primary" onClick={handleOpenConfirm}>
              //       <Iconify icon="eva:trash-2-outline" />
              //     </IconButton>
              //   </Tooltip>
              // }
            />

            <Scrollbar>
              <Table size='small' sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={tableData.length}
                  // numSelected={selected.length}
                  onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row._id)
                  //   )
                  // }
                />

                <TableBody>

                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
                    ))}

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
            // dense={dense}
            // onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter( (securityUser) => securityUser?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  || 
    securityUser?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 || 
    securityUser?.phone?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0  || 
    securityUser?.roles?.map((obj) => obj.name).join(', ').toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||  
    // (securityUser?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
    fDate(securityUser?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0  );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}

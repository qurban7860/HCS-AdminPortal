import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Table, Button, TableBody, Container, TableContainer, Tooltip, IconButton } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';

// @mui
import { StyledCardContainer } from '../../theme/styles/default-styles';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Scrollbar from '../../components/scrollbar';
import Iconify from '../../components/iconify';
import ConfirmDialog from '../../components/confirm-dialog';
// sections
import CustomerListTableRow from './CustomerListTableRow';
import CustomerListTableToolbar from './CustomerListTableToolbar';
// redux
import { getCustomers, deleteCustomer, resetCustomer, setCustomerEditFormVisibility } from '../../redux/slices/customer/customer';
import {
  resetSite,
  resetSites,
  setSiteEditFormVisibility,
  setSiteFormVisibility,
} from '../../redux/slices/customer/site';
import {
  resetContact,
  resetContacts,
  setContactEditFormVisibility,
  setContactFormVisibility,
} from '../../redux/slices/customer/contact';
import {
  resetNote,
  resetNotes,
  setNoteEditFormVisibility,
  setNoteFormVisibility,
} from '../../redux/slices/customer/note';
import {
  resetCustomerDocument,
  resetCustomerDocuments,
} from '../../redux/slices/document/customerDocument';
import { resetCustomerMachines } from '../../redux/slices/products/machine';
// hooks
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { Cover } from '../components/Defaults/Cover';
import { fDate } from '../../utils/formatTime';
import { DIALOGS, BUTTONS, FORMLABELS } from '../../constants/default-constants';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'type', label: '', align: 'center', width: 1.5 },
  { id: 'name', label: 'Customer', align: 'left' },
  { id: 'tradingName', label: 'Trading Name', align: 'left' },
  { id: 'mainSiteAddress', label: 'Address', align: 'left' },
  { id: 'active', label: 'Active', align: 'center' },
  { id: 'created_at', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CustomerList() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: '-createdAt',
  });

  const dispatch = useDispatch();
  // necessary. don't delete.
  const { themeStretch } = useSettingsContext();
  // const { enqueueSnackbar } = useSnackbar();
  const { isMobile } = useResponsive('down', 'sm');
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { customers, isLoading, error, initial, responseMessage } = useSelector(
    (state) => state.customer
  );
  // console.log("isLoading  : ",isLoading);
  useLayoutEffect(() => {
    dispatch(getCustomers());
    dispatch(resetCustomer());
    dispatch(resetSite());
    dispatch(resetSites());
    dispatch(resetContact());
    dispatch(resetContacts());
    dispatch(resetNote());
    dispatch(resetNotes());
    dispatch(resetCustomerDocument());
    dispatch(resetCustomerDocuments());
    dispatch(resetCustomerMachines());
    dispatch(setSiteFormVisibility(false));
    dispatch(setSiteEditFormVisibility(false));
    dispatch(setContactFormVisibility(false));
    dispatch(setContactEditFormVisibility(false));
    dispatch(setNoteFormVisibility(false));
    dispatch(setNoteEditFormVisibility(false));
    dispatch(setCustomerEditFormVisibility(false));
  }, [dispatch]);

  useEffect(() => {
      setTableData(customers);
  }, [customers]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  // const handleDeleteRow = async (id) => {
  //   try {
  //     // console.log(id);
  //     await dispatch(deleteCustomer(id));
  //     dispatch(getCustomers());
  //     setSelected([]);

  //     if (page > 0) {
  //       if (dataInPage.length < 2) {
  //         setPage(page - 1);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  // const handleDeleteRows = (selectedRows) => {
  //   const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id));
  //   setSelected([]);
  //   setTableData(deleteRows);

  //   if (page > 0) {
  //     if (selectedRows.length === dataInPage.length) {
  //       setPage(page - 1);
  //     } else if (selectedRows.length === dataFiltered.length) {
  //       setPage(0);
  //     } else if (selectedRows.length > dataInPage.length) {
  //       const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
  //       setPage(newPage);
  //     }
  //   }
  // };

  const handleEditRow = (id) => {
    // console.log(id);
    navigate(PATH_CUSTOMER.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_CUSTOMER.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.CUSTOMERS} />
        </StyledCardContainer>

        <Card sx={{ mt: 3 }}>
          <CustomerListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction 
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
              <Table size="small" sx={{ minWidth: 960 }}>
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
                    .map((row, index) =>
                      row ? (
                        <CustomerListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          // onDeleteRow={() => handleDeleteRow(row._id)}
                          // onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}
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
          />
        </Card>
        <Grid item md={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={DIALOGS.DELETE.title}
        content={DIALOGS.DELETE.content}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            {BUTTONS.DELETE}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  // (customer) => customer.name.toLowerCase().indexOf(filterName.toLowerCase()) || customer.tradingName.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.city.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.country.toLowerCase().indexOf(filterName.toLowerCase()) || customer.createdAt.toLowerCase().indexOf(filterName.toLowerCase()) !== -1

  if (filterName) {
    inputData = inputData.filter(
      (customer) =>
        customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.tradingName?.some((tName) => tName.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ) ||
        customer?.mainSite?.address?.city?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.mainSite?.address?.country?.toLowerCase().indexOf(filterName.toLowerCase()) >=
          0 ||
        // (customer?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(customer?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}

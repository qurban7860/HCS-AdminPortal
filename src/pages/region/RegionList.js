import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_SECURITY, PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import { Cover } from '../components/Defaults/Cover';
import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import RegionTableRow from './RegionTableRow'
import RegionTableToolbar from './RegionTableToolbar';
import {
  getRegions,
  deleteRegion,
  setRegionEditFormVisibility,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../redux/slices/region/region';
import { fDate } from '../../utils/formatTime';
// constants
import { DIALOGS } from '../../constants/default-constants';
import TableCard from '../components/ListTableTools/TableCard';
// ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = ['Administrator', 'Normal User', 'Guest User', 'Restriced User'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'xs1', label: 'countries', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  // { id: 'isVerified', label: 'Verified', align: 'center' },
  // { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
  // { id: '' },
];

// ----------------------------------------------------------------------

export default function RegionList() {
  const {
    dense,
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: '-createdAt',
  });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();

  const {
    regions,
    filterBy, page, rowsPerPage,
    error,
    responseMessage,
    initial,
    regionEditFormVisibility,
    regionAddFormVisibility,
  } = useSelector((state) => state.region);
  // console.log("regions", regions);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useLayoutEffect(() => {
    dispatch(getRegions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, regionEditFormVisibility, regionAddFormVisibility]);

  useEffect(() => {
    if (initial) {
      setTableData(regions);
    }
  }, [regions, error, enqueueSnackbar, responseMessage, initial]);

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

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      try {
        dispatch(deleteRegion(id));
        dispatch(getRegions());
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
    dispatch(setRegionEditFormVisibility(true));
    navigate(PATH_SECURITY.users.edit(id));
  };
  const handleViewRow = (id) => {
    navigate(PATH_SETTING.regions.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };
  return (
    <>
      <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
          <Cover name="Regions" generalSettings="enabled" icon="ph:users-light" />
        </Card>
        <TableCard>
          <RegionTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
          />
          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
            />

            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <RegionTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
            <TableNoData isNotFound={isNotFound} />
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}

            // dense={dense}
            // onChangeDense={onChangeDense}
          />
        </TableCard>
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
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            {DIALOGS.DELETE.title}
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
    inputData = inputData.filter(
      (region) =>
        region?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        region?.countries
          ?.map((obj) => obj.country_name)
          .join(', ')
          .toLowerCase()
          .indexOf(filterName.toLowerCase()) >= 0 ||
        // (securityUser?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(region?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}

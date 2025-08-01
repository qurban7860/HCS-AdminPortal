import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import {
  getMachineModels,
  deleteMachineModel,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../../redux/slices/products/model';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';
// sections
import { getActiveCategories, resetActiveCategories } from '../../../redux/slices/products/category';
import ModelListTableRow from './ModelListTableRow';
import ModelListTableToolbar from './ModelListTableToolbar';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
// import { RHFAutocomplete } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'category.name', visibbility: 'xs1', label: 'Category', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function ModelList() {
  const [tableData, setTableData] = useState([]);
  const {
    dense,
    order,
    orderBy,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSort,
  } = useTable({
    defaultOrderBy: 'name',
  });

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const { machineModels, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector(
    (state) => state.machinemodel
  );

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useLayoutEffect(() => {
    dispatch(getMachineModels());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(getActiveCategories());
    return () => { 
      dispatch(resetActiveCategories()); 
    }
  }, [dispatch]);  

  useEffect(() => {
    if (initial) {
      setTableData(machineModels);
    }
  }, [machineModels, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    selectedCategory, // Pass filterCategory to applyFilter
  }, [selectedCategory, filterName, filterStatus]);

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0));
    dispatch(setFilterBy(value));
  }, 500));

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    setFilterName(filterBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    await dispatch(deleteMachineModel(id));
    try {
      dispatch(getMachineModels());
      setSelected([]);
      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };


  const handleViewRow = async (id) => navigate(PATH_MACHINE.machineSettings.models.view(id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''));
    setFilterName('');
  };

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="Models" icon="material-symbols:list-alt-outline" setting />
        </StyledCardContainer>
        <TableCard>
          <ModelListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ModelListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
      </Container>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to Archive <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected);
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

function applyFilter({ inputData, comparator, filterName, filterStatus, selectedCategory }) {
  const stabilizedThis = inputData ? inputData?.map((el, index) => [el, index]) : [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  
  if (filterName) {
    inputData = inputData.filter(
      (filterModel) =>
        filterModel?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        filterModel?.category?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (filterModel?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(filterModel?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }
  
  if (selectedCategory) {
    inputData = inputData.filter(
      (customer) => customer?.category?._id === selectedCategory._id
    );
  }

  return inputData;
}
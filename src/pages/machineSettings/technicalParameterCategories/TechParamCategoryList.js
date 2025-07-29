import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {  Table, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import {
  getTechparamcategories,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../../redux/slices/products/machineTechParamCategory';
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
// sections
import TechParamCategoryListTableRow from './TechParamCategoryListTableRow';
import TechParamCategoryListTableToolbar from './TechParamCategoryListTableToolbar';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Technnical Parameter Category', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];



// ----------------------------------------------------------------------

export default function TechParamCategoryList() {
  const {
    dense,
    order,
    orderBy,
    setPage,
    //
    selected,
    //
    onSort,
  } = useTable({
    // defaultOrderBy: 'name',
    // modifiedOnSort('name')
  });

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const [tableData, setTableData] = useState([]);

  const [filterStatus, setFilterStatus] = useState([]);

  const { techparamcategories, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector(
    (state) => state.techparamcategory
  );

    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useLayoutEffect(() => {
    dispatch(getTechparamcategories());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(techparamcategories);
    }
  }, [techparamcategories, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);


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

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };




  const handleViewRow = (id) => navigate(PATH_MACHINE.machineSettings.technicalParameterCategories.view(id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover
            name="Technical Parameter Categories"
            icon="material-symbols:list-alt-outline"
            setting
          />
        </StyledCardContainer>
        <TableCard>
          <TechParamCategoryListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
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
                        <TechParamCategoryListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          // onSelectRow={() => onSelectRow(row._id)}
                          // onDeleteRow={() => handleDeleteRow(row._id)}
                          // onEditRow={() => handleEditRow(row._id)}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData ? inputData?.map((el, index) => [el, index]) : [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (produc) =>
        produc?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (produc?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(produc?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}

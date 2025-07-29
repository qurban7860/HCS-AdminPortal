import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Table, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import { getDepartments, deleteDepartment, ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setReportHiddenColumns, } from '../../../../redux/slices/department/department';
import { PATH_CRM } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
// import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TableHeadFilter,

} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
// sections
import ListTableRow from './DepartmentListTableRow';
import ListTableToolbar from './DepartmentListTableToolbar';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { FORMLABELS } from '../../../../constants/default-constants';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'departmentName', label: 'Name', align: 'left' },
  { id: 'departmentType', label: 'Type', align: 'center' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'forCustomer', label: 'Customer', align: 'center' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function DepartmentList() {
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
  // const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const { departments, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage, reportHiddenColumns } = useSelector((state) => state.department);
    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useLayoutEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(departments);
    }
  }, [departments, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
  },[filterBy])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    await dispatch(deleteDepartment(id));
    try {
      dispatch(getDepartments());
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


  const handleViewRow = (id) => {
    navigate(PATH_CRM.departments.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.DEPARTMENTS} icon="material-symbols:list-alt-outline"/>
        </StyledCardContainer>

        <TableCard>
          <ListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
          {!isNotFound && (
            <TablePaginationFilter
              columns={TABLE_HEAD}
              hiddenColumns={reportHiddenColumns}
              handleHiddenColumns={handleHiddenColumns}
              count={dataFiltered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>

                <TableHeadFilter
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  hiddenColumns={reportHiddenColumns}
                  onSort={onSort}
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ListTableRow
                          key={row._id}
                          row={row}
                          hiddenColumns={reportHiddenColumns}
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
           {!isNotFound && (
            <TablePaginationFilter
              count={dataFiltered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />)}
                </TableCard>
      
      </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (category) =>
        category?.departmentName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        category.departmentType?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(category?.updatedAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Grid, Table, Button, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
// routes
import { getTools, getTool, deleteTool,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
 } from '../../../redux/slices/products/tools';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';
// sections
import ToolListTableRow from './ToolListTableRow';
import ToolListTableToolbar from './ToolListTableToolbar';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { fDate } from '../../../utils/formatTime';
// constants
import { FORMLABELS, DIALOGS, BUTTONS } from '../../../constants/default-constants';
import TableCard from '../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'isDisabled', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

const STATUS_OPTIONS = [
  // { id: '1', value: 'Order Received' },
  // { id: '2', value: 'In Progress' },
  // { id: '3', value: 'Ready For Transport' },
  // { id: '4', value: 'In Freight' },
  // { id: '5', value: 'Deployed' },
  // { id: '6', value: 'Archived' },
];

// ----------------------------------------------------------------------

export default function ToolList() {
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
    defaultOrderBy: 'name',
  });

  const dispatch = useDispatch();
  // const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { tools, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector((state) => state.tool);
  
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useLayoutEffect(() => {
    // console.log('Testing done')
    dispatch(getTools());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(tools);
    }
  }, [tools, error, responseMessage, enqueueSnackbar, initial]);

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

  // const handleOpenConfirm = () => {
  //   setOpenConfirm(true);
  // };

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

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    await dispatch(deleteTool(id));
    try {
      // console.log(id);
      // await dispatch(deleteSupplier(id));
      dispatch(getTools());
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

  // const handleEditRow = async (id) => {
  //   // console.log(id);
  //   // dispatch(getTool(id));
  //   await dispatch(getTool(id));
  //   navigate(PATH_MACHINE.machines.settings.tool.edit(id));
  // };

  const handleViewRow = async (id) => {
    // console.log(id,PATH_MACHINE.supplier.view(id));
    // console.log(id)
    await dispatch(getTool(id));
    navigate(PATH_MACHINE.machines.settings.tool.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.TOOLS} setting />
        </StyledCardContainer>

        <TableCard>
          <ToolListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
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
                        <ToolListTableRow
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
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
      </Container>
      <Grid item lg={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
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
  const stabilizedThis = inputData ? inputData?.map((el, index) => [el, index]) : [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (filtertool) =>
        filtertool?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (filtertool?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(filtertool?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}

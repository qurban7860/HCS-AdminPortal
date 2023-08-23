import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import {
  Grid,
  Table,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
// sections
import DocumentListTableRow from './DrawingListTableRow';
import DocumentListTableToolbar from './DrawingListTableToolbar';
import {
  getDocumentHistory,
  resetDocumentHistory,
} from '../../../redux/slices/document/document';
import {
  getDrawings,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------


export default function DrawingList() {
  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    onSelectAllRows,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: '-createdAt',
  });

  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { machine } = useSelector((state) => state.machine);

  const { drawings, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.drawing );

  const TABLE_HEAD = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'xs1', label: 'Category', align: 'left' },
    { id: 'xs2', label: 'Type', align: 'left' },
    { id: 'active', label: 'Active', align: 'center' },
    { id: 'created_at', label: 'Created At', align: 'right' },
  ];

    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    if(machine?._id){
      dispatch(getDrawings(machine?._id));
    }
  }, [dispatch, machine]);

  useEffect(() => {
    setTableData(drawings);
  }, [drawings]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);


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

  const handleViewRow = (documentId) => {
      dispatch(resetDocumentHistory())
      dispatch(getDocumentHistory(documentId));
      dispatch(setDrawingViewFormVisibility(true));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
      <TableCard>
        <DocumentListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
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
            <Table size="small" sx={{ minWidth: 360 }}>
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
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <DocumentListTableRow
                        key={row._id}
                        row={row}
                        // selected={selected.includes(row._id)}
                        // onSelectRow={() => onSelectRow(row._id)}
                        // onDeleteRow={() => handleDeleteRow(row._id)}
                        // onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row?.document?._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

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
        <Grid item md={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>
      </TableCard>

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
              // handleDeleteRows(selected);
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

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (drawingg) =>
        drawingg?.document?.displayName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        drawingg?.documentType?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        drawingg?.documentCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (document?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(drawingg?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((drawingg) => filterStatus.includes(drawingg.status));
  }

  return inputData;
}

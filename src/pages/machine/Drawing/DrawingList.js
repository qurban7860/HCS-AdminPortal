import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  Button,
  TableBody,
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
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
// sections
import DrawingListTableRow from './DrawingListTableRow';
import DrawingListTableToolbar from './DrawingListTableToolbar';
import {
  getDocumentHistory,
  resetDocumentHistory,
} from '../../../redux/slices/document/document';
import {
  getDrawings,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setDrawingViewFormVisibility, 
  resetDrawings,
  deleteDrawing} from '../../../redux/slices/products/drawing';
import { useSnackbar } from '../../../components/snackbar';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import { Snacks } from '../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function DrawingList() {
  const {
    order,
    orderBy,
    setPage,
    selected,
    setSelected,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();

  const { drawings, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.drawing );

  const TABLE_HEAD = [
    { id: 'referenceNumber', label: 'Ref', align: 'left' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'stockNumber', label: 'Stock Number', align: 'left' },
    { id: 'xs2', label: 'Type', align: 'left' },
    { id: 'xs1', label: 'Category', align: 'left' },
    { id: 'active', label: 'Active', align: 'center' },
    { id: 'created_at', label: 'Created At', align: 'right' },
    { id: 'action', label: '', align: 'right' },
  ];
    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    if(machine?._id){
      dispatch(resetDrawings());
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

  const handleDeleteRow = async (drawingId) => {
    console.log("drawingId:::::",drawingId)
    try {
      await dispatch(deleteDrawing(drawingId));
      await dispatch(resetDrawings());
      await dispatch(getDrawings(machine?._id));
      enqueueSnackbar(Snacks.deletedDrawing, { variant: `success` });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(Snacks.failedDeleteDrawing, { variant: `error` });
    }

    
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
      <TableCard>
        <DrawingListTableToolbar
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
                      <DrawingListTableRow
                        key={row._id}
                        row={row}
                        onViewRow={() => handleViewRow(row?.document?._id)}
                        onDeleteRow={() => {
                          setSelected(row?._id);
                          handleOpenConfirm(true);

                        }}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
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

        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </TableCard>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected)
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
        drawingg?.document.stockNumber?.toString()?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        drawingg?.document.referenceNumber?.toString()?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(drawingg?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((drawingg) => filterStatus.includes(drawingg.status));
  }

  return inputData;
}

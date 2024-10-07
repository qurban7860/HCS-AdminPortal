import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import {
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
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
// sections
import DrawingListTableRow from './DrawingListTableRow';
import DrawingListTableToolbar from './DrawingListTableToolbar';
import { getActiveDocumentCategories, resetActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { getActiveDocumentTypes, resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import {
  getDrawings,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy, 
  resetDrawings,
  getDrawing, } from '../../../redux/slices/products/drawing';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function DrawingList() {
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({
    defaultOrderBy: 'doNotOrder', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [categoryVal, setCategoryVal] = useState(null);
  const [typeVal, setTypeVal] = useState(null);

  const { machine } = useSelector((state) => state.machine);
  const { drawings, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.drawing );

  const TABLE_HEAD = [
    { id: 'document.displayName', label: 'Name', align: 'left' },
    { id: 'document.referenceNumber', label: 'Ref', align: 'left' },
    { id: 'document.stockNumber', label: 'Stock Number', align: 'left' },
    { id: 'documentType.name', visibility: 'xs2', label: 'Type', align: 'left' },
    { id: 'documentCategory.name', visibility: 'xs1', label: 'Category', align: 'left' },
    { id: 'isActive', label: 'Active', align: 'center' },
    { id: 'createdAt', label: 'Created At', align: 'right' },
  ];
    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    if( machineId ){
      dispatch(getDrawings( machineId, machine?.isArchived  ));
      dispatch(getActiveDocumentCategories());
      dispatch(getActiveDocumentTypes());
    } 
    return () => {
      dispatch(resetDrawings());
      dispatch(resetActiveDocumentCategories());
      dispatch(resetActiveDocumentTypes());
    }
  }, [dispatch, machineId, machine ]);

  useEffect(() => {
    setTableData(drawings);
  }, [drawings]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    orderBy,
    filterName,
    filterStatus,
    categoryVal,
    typeVal,
  });

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

  const handleViewRow = async (drawingId, documentId) => {
    await dispatch(getDrawing(drawingId))
    await navigate(PATH_MACHINE.machines.drawings.view.root(machineId, documentId ))
  } 

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue='drawings' />
      <TableCard>
        <DrawingListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          categoryVal={categoryVal}
          setCategoryVal={setCategoryVal}
          typeVal={typeVal}
          setTypeVal={setTypeVal}
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
                        onViewRow={() => handleViewRow(row._id, row?.document?._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: 60 }} />
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
  </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, orderBy, filterName, filterStatus, categoryVal, typeVal }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  if( orderBy !== 'doNotOrder' ){
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  }

  inputData = stabilizedThis.map((el) => el[0]);
  if(categoryVal)
    inputData = inputData.filter((drawing)=> drawing.documentCategory?._id  === categoryVal?._id );

  if(typeVal)
    inputData = inputData.filter((drawing)=> drawing.documentType?._id === typeVal?._id );


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

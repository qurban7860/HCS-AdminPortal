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
  getDrawing,
} from '../../../redux/slices/products/drawing';
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
    { id: 'updatedAt', label: 'Updated At', align: 'right' },
  ];
    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const onChangePage = (event, newPage) => {
    dispatch(ChangePage(newPage));
  };

  // Fetch data once on mount or when machineId or isArchived changes
  useEffect(() => {
    if (machineId) {
      dispatch(getDrawings(machineId, machine?.isArchived));
      dispatch(getActiveDocumentCategories(null, null, true));
      dispatch(getActiveDocumentTypes(null, true));
    }
    return () => {
      dispatch(resetDrawings());
      dispatch(resetActiveDocumentCategories());
      dispatch(resetActiveDocumentTypes());
    };
  }, [dispatch, machineId, machine?.isArchived]);

  // Update local table data when drawings change
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

  
  const debouncedSearch = useRef(
    debounce((value) => {
      dispatch(ChangePage(0));
      dispatch(setFilterBy(value));
    }, 500)
  );


  useEffect(() => {
    const debounced = debouncedSearch.current;
    return () => {
      debounced.cancel();
    };
  }, []);

  
  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value);
    setPage(0);
  };
  
  // Initialize filterName from redux filterBy on mount
  useEffect(() => {
    setFilterName(filterBy);
  }, [filterBy]);

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = async (drawingId, documentId) => {
    await dispatch(getDrawing(drawingId));
    await navigate(PATH_MACHINE.machines.drawings.view.root(machineId, documentId));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''));
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
          drawing
        />
        {!isNotFound && (
          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
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
                  .map((row, index) => {
                    if (row) {
                      return (
                        <DrawingListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row._id, row?.document?._id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        />
                      );
                    }
                    return !isNotFound ? <TableSkeleton key={index} sx={{ height: 60 }} /> : null;
                  })}
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
  if (!inputData) return [];

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  if (orderBy !== 'doNotOrder') {
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  }

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (categoryVal) {
    filteredData = filteredData.filter((drawing) => drawing.documentCategory?._id === categoryVal?._id);
  }

  if (typeVal) {
    filteredData = filteredData.filter((drawing) => drawing.documentType?._id === typeVal?._id);
  }

  if (filterName) {
    const lowerFilter = filterName.toLowerCase();
    filteredData = filteredData.filter(
      (drawing) =>
        drawing?.document?.displayName?.toLowerCase().includes(lowerFilter) ||
        drawing?.documentType?.name?.toLowerCase().includes(lowerFilter) ||
        drawing?.documentCategory?.name?.toLowerCase().includes(lowerFilter) ||
        drawing?.document.stockNumber?.toString()?.toLowerCase().includes(lowerFilter) ||
        drawing?.document.referenceNumber?.toString()?.toLowerCase().includes(lowerFilter) ||
        fDate(drawing?.createdAt)?.toLowerCase().includes(lowerFilter)
    );
  }

  if (filterStatus.length) {
    filteredData = filteredData.filter((drawing) => filterStatus.includes(drawing.isActive));
  }

  return filteredData;
}

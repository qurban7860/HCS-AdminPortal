import { useState, useEffect } from 'react';
// @mui
import {
  Stack,
  Card,
  Grid,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
// components
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import { useTable, getComparator, TableNoData } from '../../components/table';
import Iconify from '../../components/iconify';
// sections
import { setLicenseFormVisibility } from '../../redux/slices/products/license';
import LicenseAddForm from './License/LicenseAddForm';
import LicenseEditForm from './License/LicenseEditForm';
import LicenseViewForm from './License/LicenseViewForm';
import { fDate } from '../../utils/formatTime';
// constants
import { BREADCRUMBS, BUTTONS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

// const _accordions = [...Array(8)].map((_, index) => ({
//   id: _mock.id(index),
//   value: `panel${index + 1}`,
//   heading: `Site ${index + 1}`,
//   subHeading: _mock.text.title(index),
//   detail: _mock.text.description(index),
// }));

// ----------------------------------------------------------------------

export default function MachineLicenseList() {
  const { dense, page, order, orderBy, rowsPerPage } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const isMobile = useResponsive('down', 'sm');
  const [controlled, setControlled] = useState(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();

  const { initial, error, responseMessage, licenseEditFormVisibility, licenses, formVisibility } =
    useSelector((state) => state.license);
  const { machine } = useSelector((state) => state.machine);

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const toggleChecked = async () => {
    dispatch(setLicenseFormVisibility(!formVisibility));
  };

  const toggleCancel = () => {
    dispatch(setLicenseFormVisibility(false));
  };

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (initial) {
      setTableData(licenses);
    }
  }, [licenses, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 60 : 80;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = !licenses.length && !formVisibility && !licenseEditFormVisibility;

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ fontSize: '12px', color: 'text.disabled' }}
          >
            <BreadcrumbsLink to={PATH_MACHINE.machines.list} name={BREADCRUMBS.MACHINES} />
            <BreadcrumbsLink to={PATH_MACHINE.machines.view(machine._id)} name={machine.serialNo} />
            <BreadcrumbsLink
              to={PATH_MACHINE.machines.settings}
              name={
                <Stack>
                  {!expanded &&
                    !licenseEditFormVisibility &&
                    formVisibility &&
                    BREADCRUMBS.NEWLICENSE}
                  {!formVisibility && !licenseEditFormVisibility && BREADCRUMBS.LICENSE}
                  {licenseEditFormVisibility && BREADCRUMBS.EDITLICENSE}
                </Stack>
              }
            />
          </Breadcrumbs>
        </Grid>
        <AddButtonAboveAccordion
          name={BUTTONS.NEWLICENSE}
          toggleChecked={toggleChecked}
          FormVisibility={formVisibility}
          toggleCancel={toggleCancel}
          disabled={licenseEditFormVisibility}
        />
      </Grid>
      <Card>
        {formVisibility && !licenseEditFormVisibility && <LicenseAddForm />}
        {licenseEditFormVisibility && <LicenseEditForm />}
        {!formVisibility &&
          !licenseEditFormVisibility &&
          licenses.map((license, index) => {
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return (
              <Accordion
                key={license._id}
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{ borderTop: borderTopVal }}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  onClick={() => handleAccordianClick(index)}
                >
                  {index !== activeIndex ? (
                    <Grid container spacing={0}>
                      {/* <Grid item xs={12} sm={3} md={2}>
                    {license?.license?.name || "" }
                  </Grid> */}
                      <Grid item xs={12} sm={6} md={8}>
                        {license?.licenseDetail?.length > 100
                          ? license?.licenseDetail.substring(0, 100)
                          : license?.licenseDetail}
                        {license?.licenseDetail?.length > 100 ? '...' : null}
                      </Grid>

                      <Grid item xs={12} sm={3} md={2}>
                        <Typography variant="body2">{fDate(license?.createdAt || '')}</Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                </AccordionSummary>
                <AccordionDetails sx={{ mt: -5 }}>
                  <LicenseViewForm currentTool={license} />
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Card>
      <Grid md={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
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

  if (filterName) {
    inputData = inputData.filter(
      (site) => site.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((site) => filterStatus.includes(site.status));
  }

  return inputData;
}

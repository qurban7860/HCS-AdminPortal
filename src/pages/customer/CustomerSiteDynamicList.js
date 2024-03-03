import { useState, useEffect } from 'react';
// @mui
import { Stack, Card, Grid, CardActionArea } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CardBase,
  GridBaseViewForm,
  StyledScrollbar,
} from '../../theme/styles/customer-styles';
import SiteCarousel from './site/util/SiteCarousel';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { getComparator, useTable } from '../../components/table';
import AddButtonAboveAccordion from '../../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsProvider from '../../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../../components/Breadcrumbs/BreadcrumbsLink';
import GoogleMaps from '../../assets/GoogleMaps';
import useResponsive from '../../hooks/useResponsive';
import { getSites, resetSites, getSite, setSiteFormVisibility, resetSiteFormsVisiblity, setIsExpanded, setCardActiveIndex } from '../../redux/slices/customer/site';
import NothingProvided from '../../components/Defaults/NothingProvided';
import SiteAddForm from './site/SiteAddForm';
import SiteEditForm from './site/SiteEditForm';
import SiteViewForm from './site/SiteViewForm';
import SearchInput from '../../components/Defaults/SearchInput';
import { fDate } from '../../utils/formatTime';
import { Snacks } from '../../constants/customer-constants';
import { BUTTONS, BREADCRUMBS, TITLES } from '../../constants/default-constants';
import Iconify from '../../components/iconify';
import ContactSiteCard from '../../components/sections/ContactSiteCard';
import { exportCSV } from '../../utils/exportCSV';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function CustomerSiteDynamicList(defaultValues = { lat: 0, long: 0 }) {

  const { order, orderBy } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });
  const { site } = useSelector((state) => state.site);
  const { isAllAccessAllowed } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  // const [ activeCardIndex, setCardActiveIndex ] = useState(null);
  // const [ isExpanded, setIsExpanded ] = useState(false);
  const [ filterName, setFilterName ] = useState('');
  const [ filterStatus, setFilterStatus ] = useState([]);
  const [ tableData, setTableData ] = useState([]);
  const [ googleMapsVisibility, setGoogleMapsVisibility ] = useState(false);
  const isMobile = useResponsive('down', 'sm');
  const dispatch = useDispatch();
  const { sites, isExpanded, activeCardIndex, error, responseMessage, siteEditFormVisibility, siteAddFormVisibility } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  // for filtering sites
  const isFiltered = filterName !== '' || !!filterStatus.length;

  const toggleChecked = () => {
    if (siteEditFormVisibility) {
      dispatch(setSiteFormVisibility(false));
      enqueueSnackbar(Snacks.SITE_CLOSE_CONFIRM, {
        variant: 'warning',
      });
      dispatch(setCardActiveIndex(null));
      dispatch(setIsExpanded(false));
    } else {
      dispatch(setSiteFormVisibility(true));
      dispatch(setCardActiveIndex(null));
      dispatch(setIsExpanded(false));
    }
  };

  // -----------------------Filtering----------------------------

  const handleFilterName = (e) => {
    setFilterName(e.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  useEffect(() => {
    setTableData(sites);
  }, [sites, error, responseMessage]);
  
  useEffect(() => {
    dispatch(resetSiteFormsVisiblity());
  }, [dispatch]);

  

  // ------------------------------------------------------------

  const toggleCancel = () => {
    dispatch(setSiteFormVisibility(false));
    // setChecked(false);
  };

  const handleGoogleMapsVisibility = () => {
    setGoogleMapsVisibility(!googleMapsVisibility);
  };

  const handleActiveCard = (index) => {
    dispatch(setCardActiveIndex(index));
  };
  const handleExpand = (index) => {
    dispatch(setIsExpanded(true));
  };

  useEffect( () => {
      dispatch(getSites(customer._id));
      return ()=>{ dispatch(resetSites()) }
  }, [dispatch, customer]); 

  // conditions for rendering the contact view, edit, and add forms
  const shouldShowSiteView = isExpanded && !siteEditFormVisibility && !siteAddFormVisibility;
  const shouldShowSiteEdit = siteEditFormVisibility && !siteAddFormVisibility;
  const shouldShowSiteAdd = siteAddFormVisibility && !siteEditFormVisibility;

  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('CustomerSites', customer?._id));
    response.then((res) => {
      setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };


  const handleCardClick = async (_site)=>{
    await dispatch(getSite(customer._id, _site._id));
    if (!siteEditFormVisibility && !siteAddFormVisibility) {
      handleActiveCard(_site._id);
      handleExpand(_site._id);
    }
}

  return (
    <>
      {/* <Stack alignItems="flex-end" sx={{ mt: 4, padding: 2 }}></Stack> */}
      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{mb:2}}>
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
            <BreadcrumbsLink
              to={PATH_CUSTOMER.contacts}
              name={
                <Stack>
                  {!siteAddFormVisibility && !siteEditFormVisibility && !isExpanded && 'Sites'}
                  {siteEditFormVisibility ? `Edit ${site?.name}` : isExpanded && site?.name}
                  {siteAddFormVisibility && !isExpanded && 'New Site Form'}
                </Stack>
              }
            />
          </BreadcrumbsProvider>
        </Grid>
        <Grid item xs={12} md={6} style={{display:'flex', justifyContent:'flex-end'}}>
          <Stack direction='row' alignContent='flex-end' spacing={1} >
            {isAllAccessAllowed && sites.length>0 &&
              <LoadingButton variant='contained' onClick={onExportCSV} loading={exportingCSV} startIcon={<Iconify icon={BUTTONS.EXPORT.icon} />} >
                  {BUTTONS.EXPORT.label}
              </LoadingButton>
            }
            <AddButtonAboveAccordion
              name={BUTTONS.NEWSITE}
              toggleChecked={toggleChecked}
              FormVisibility={siteAddFormVisibility}
              toggleCancel={toggleCancel}
              disabled={siteEditFormVisibility}
            />
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={1} direction="row" justifyContent="flex-start">
      <Grid item xs={12} sm={12} md={12} lg={5} xl={4} sx={{ display: siteAddFormVisibility && isMobile && 'none' }} >
        {sites.length > 0 && (
          <>
            {sites.length > 5 && (
              <Grid item md={12}>
                <SearchInput
                  disabled={siteAddFormVisibility || siteEditFormVisibility}
                  filterName={filterName}
                  handleFilterName={handleFilterName}
                  isFiltered={isFiltered}
                  handleResetFilter={handleResetFilter}
                  toggleChecked={toggleChecked}
                  toggleCancel={toggleCancel}
                  FormVisibility={siteAddFormVisibility}
                  sx={{ position: 'fixed', top: '0px', zIndex: '1000' }}
                />
              </Grid>
            )}
            <StyledScrollbar
              maxHeight={155}
              snap
              snapOffset={50}
              onClick={(e) => e.stopPropagation()}
              snapAlign="start"
              contacts={sites.length}
              disabled={siteEditFormVisibility || siteAddFormVisibility}
            >
              <Grid container direction="column" gap={1}>
                {dataFiltered.map((_site, index) => (
                  <ContactSiteCard
                    key={index}
                    isActive={_site._id === activeCardIndex}
                    handleOnClick={() => handleCardClick(_site) }
                    disableClick={siteEditFormVisibility || siteAddFormVisibility}
                    name={_site?.name} 
                    title={`${_site?.address?.country || '' }${(_site?.address?.country && _site?.address?.city) ? ',' : '' } ${_site?.address?.city || '' }`} 
                    phone={_site?.phoneNumbers?.find( n => n?.type?.toLowerCase() === 'mobile' )}
                    email={_site?.website || ""}
                    image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                  />)
                )}
              </Grid>

            </StyledScrollbar>
            </>
        )}
        </Grid>
        {/* Google Maps View */}
        {isMobile && googleMapsVisibility && (
          <Grid item md={12}>
            <Grid container direction="row" gap={1}>
              <Card>
                <CardActionArea>
                  {site?.lat && site?.long && (
                    <GoogleMaps
                      key={`mob-${site}`}
                      mapHeight="400px"
                      lat={site.lat ? site.lat : 0}
                      lng={site.long ? site.long : 0}
                    />
                  )}
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Conditional View Forms */}
        <GridBaseViewForm item xs={12} sm={12} md={12} lg={7} xl={8}>
          {shouldShowSiteView && (
            <CardBase>
              <SiteViewForm
                currentSite={site}
                handleMap={() => {
                  handleGoogleMapsVisibility(true);
                }}
              />
              <Grid item lg={12}>
                {!isMobile && (
                  <Grid container direction="row" gap={4}>
                    <Grid item md={12}>
                      {site?.lat && site?.long ? (
                        <Card>
                          <CardActionArea>
                            <GoogleMaps
                              key={`desk-${site}`}
                              lat={site?.lat ? site.lat : 0}
                              lng={site?.long ? site.long : 0}
                            />
                          </CardActionArea>
                        </Card>
                      ) : (
                        <NothingProvided content={TITLES.NO_SITELOC} />
                      )}
                    </Grid>

                    <Grid item md={12}>
                      <Card>
                      <SiteCarousel />
                        {/* <CardActionArea>
                          <CardMedia
                            component={SiteCarousel}
                            image={<SiteCarousel />}
                            alt={sites[activeIndex]?.name}
                          />
                        </CardActionArea> */}
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </CardBase>
          )}
          {shouldShowSiteEdit && <SiteEditForm />}
          {shouldShowSiteAdd && <SiteAddForm />}
        </GridBaseViewForm>
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (site) =>
        site?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        site?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(site?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}

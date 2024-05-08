import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Container, Stack, Card, Grid, CardActionArea } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CardBase,
  GridBaseViewForm,
  StyledScrollbar,
} from '../../../theme/styles/customer-styles';
import SiteCarousel from './util/SiteCarousel';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_CRM } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import AddButtonAboveAccordion from '../../../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsProvider from '../../../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../../../components/Breadcrumbs/BreadcrumbsLink';
import GoogleMaps from '../../../assets/GoogleMaps';
import useResponsive from '../../../hooks/useResponsive';
import { getSites, resetSites, setIsExpanded, setCardActiveIndex } from '../../../redux/slices/customer/site';
import NothingProvided from '../../../components/Defaults/NothingProvided';
import SiteAddForm from './SiteAddForm';
import SiteEditForm from './SiteEditForm';
import SiteViewForm from './SiteViewForm';
import SearchInput from '../../../components/Defaults/SearchInput';
import { fDate } from '../../../utils/formatTime';
import { Snacks } from '../../../constants/customer-constants';
import { BUTTONS, BREADCRUMBS, TITLES } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import ContactSiteCard from '../../../components/sections/ContactSiteCard';
import { exportCSV } from '../../../utils/exportCSV';
import { useAuthContext } from '../../../auth/useAuthContext';
import CustomerTabContainer from '../customers/util/CustomerTabContainer';

// ----------------------------------------------------------------------

CustomerSiteDynamicList.propTypes = {
  siteAddForm: PropTypes.bool,
  siteEditForm: PropTypes.bool,
  siteViewForm: PropTypes.bool,
};

export default function CustomerSiteDynamicList({ siteAddForm, siteEditForm, siteViewForm }) {
  const { customer } = useSelector((state) => state.customer);
  const { sites, site, isExpanded, activeCardIndex } = useSelector((state) => state.site);
  const { isAllAccessAllowed } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  const [ filterName, setFilterName ] = useState('');
  const [ filterStatus, setFilterStatus ] = useState([]);
  const [ tableData, setTableData ] = useState([]);
  const [ googleMapsVisibility, setGoogleMapsVisibility ] = useState(false);
  const { customerId } = useParams() 
  const [ exportingCSV, setExportingCSV ] = useState(false);

  const isMobile = useResponsive('down', 'sm');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const toggleChecked = () => {
    if (siteEditForm) {
      enqueueSnackbar(Snacks.SITE_CLOSE_CONFIRM, { variant: 'warning' });
      dispatch(setCardActiveIndex(null));
      dispatch(setIsExpanded(false));
      if(customerId ) navigate(PATH_CRM.customers.sites.new(customerId))
    } else {
      if(customerId ) navigate(PATH_CRM.customers.sites.new(customerId))
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
    filterName,
  });

  useEffect( () => {
    if( customerId ){
      dispatch(getSites(customerId, customer?.isArchived || false));
    }
    return ()=>{ 
      dispatch(resetSites());
      dispatch(setCardActiveIndex(null));
      dispatch(setIsExpanded(false));
    }
  }, [dispatch, customerId, customer?.isArchived ]); 

  useEffect(()=>{
    if( Array.isArray(sites) && sites?.length > 0 && customerId && !siteAddForm && !siteEditForm && !siteViewForm ){
      navigate(PATH_CRM.customers.sites.view( customerId, sites[0]?._id))
    }
  },[ sites, customerId, navigate, siteAddForm, siteEditForm, siteViewForm ])

  useEffect(() => {
    setTableData(sites);
  }, [sites ]);
  

  const toggleCancel = () => { if(customerId ) navigate(PATH_CRM.customers.sites.root(customerId))};
  const handleGoogleMapsVisibility = () => setGoogleMapsVisibility(!googleMapsVisibility);

  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('CustomerSites', customerId));
    response.then((res) => {
      setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };


  const handleCardClick = async (_site)=>{
    if(customerId && _site._id ){
        await navigate(PATH_CRM.customers.sites.view(customerId, _site?._id))
    }
}

  return (
    <Container maxWidth={ false }>
      <CustomerTabContainer currentTabValue="sites" />
      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{mb:2}}>
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CRM.customers.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CRM.customers.view(customerId)} name={customer.name} />
            <BreadcrumbsLink
              to={PATH_CRM.customers.sites.root(customerId)}
              name={
                <Stack>
                  {!siteAddForm && !siteEditForm && !isExpanded && 'Sites'}
                  {siteEditForm ? `Edit ${site?.name}` : isExpanded && site?.name}
                  {siteAddForm && !isExpanded && 'New Site Form'} 
                </Stack>
              }
            />
          </BreadcrumbsProvider>
        </Grid>
        <Grid item xs={12} md={6} style={{display:'flex', justifyContent:'flex-end'}}>
          <Stack direction='row' alignContent='flex-end' spacing={1} >
            {!customer?.isArchived && isAllAccessAllowed && sites.length>0 &&
              <LoadingButton variant='contained' onClick={onExportCSV} loading={exportingCSV} startIcon={<Iconify icon={BUTTONS.EXPORT.icon} />} >
                  {BUTTONS.EXPORT.label}
              </LoadingButton>
            }
            {!customer?.isArchived && <AddButtonAboveAccordion
              name={BUTTONS.NEWSITE}
              toggleChecked={toggleChecked}
              FormVisibility={siteAddForm}
              toggleCancel={toggleCancel}
              disabled={siteEditForm}
            />}
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={1} direction="row" justifyContent="flex-start">
      <Grid item xs={12} sm={12} md={12} lg={5} xl={4} 
        sx={{ display: siteAddForm && isMobile && 'none' }} 
      >
        {sites.length > 0 && (
          <>
            {sites.length > 5 && (
              <Grid item md={12}>
                <SearchInput
                  disabled={ siteAddForm || siteEditForm }
                  filterName={filterName}
                  handleFilterName={handleFilterName}
                  isFiltered={isFiltered}
                  handleResetFilter={handleResetFilter}
                  toggleChecked={toggleChecked}
                  toggleCancel={toggleCancel}
                  FormVisibility={siteAddForm}
                  sx={{ position: 'fixed', top: '0px', zIndex: '1000' }}
                />
              </Grid>
            )}
            <StyledScrollbar
              snap
              snapOffset={100}
              onClick={(e) => e.stopPropagation()}
              snapAlign="start"
              contacts={sites.length}
              disabled={siteEditForm || siteAddForm}
            >
              <Grid container direction="column" gap={1}>
                {dataFiltered.map((_site, index) => (
                  <ContactSiteCard
                    isMain={customer?.mainSite?._id === _site?._id }
                    key={_site?._id || index }
                    isActive={_site._id === activeCardIndex}
                    handleOnClick={() => handleCardClick(_site) }
                    disableClick={siteEditForm || siteAddForm}
                    name={_site?.name} 
                    title={`${_site?.address?.country || '' }${(_site?.address?.country && _site?.address?.city) ? ',' : '' } ${_site?.address?.city || '' }`} 
                    phone={_site?.phoneNumbers?.find( n => n?.type?.toLowerCase() === 'mobile' && n?.contactNumber !== undefined && n?.contactNumber !== '' )}
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
          { siteViewForm && !siteAddForm && !siteEditForm && (
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
          { !siteViewForm && siteAddForm && !siteEditForm&& <SiteAddForm />}
          { !siteViewForm && !siteAddForm && siteEditForm && <SiteEditForm />}
        </GridBaseViewForm>
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, filterName}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

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

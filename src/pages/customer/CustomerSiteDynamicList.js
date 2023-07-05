import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { Stack, Card, CardMedia, Grid, CardActionArea, Link, Breadcrumbs } from '@mui/material';
import {
  CardBase,
  GridBaseViewForm,
  StyledScrollbar,
  StyledCardWrapper,
} from '../../theme/styles/customer-styles';
import SiteCarousel from './site/util/SiteCarousel';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD, PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { TableNoData, getComparator, useTable } from '../../components/table';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import GoogleMaps from '../../assets/GoogleMaps';
import useResponsive from '../../hooks/useResponsive';
import { getSites, getSite, setSiteFormVisibility } from '../../redux/slices/customer/site';
import SiteAddForm from './site/SiteAddForm';
import SiteEditForm from './site/SiteEditForm';
import DetailsSection from '../components/Sections/DetailsSection';
import AvatarSection from '../components/Sections/AvatarSection';
import SiteViewForm from './site/SiteViewForm';
import SearchInput from '../components/Defaults/SearchInput';
import { fDate } from '../../utils/formatTime';
import { Snacks } from '../../constants/customer-constants';
import { BUTTONS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

export default function CustomerSiteList(defaultValues = { lat: 0, long: 0 }) {
  const { order, orderBy } = useTable({ defaultOrderBy: 'name' });
  const [checked, setChecked] = useState(false);
  const [openSite, setOpenSite] = useState(false);
  const { site } = useSelector((state) => state.site);
  const { enqueueSnackbar } = useSnackbar();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCardIndex, setCardActiveIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [googleMapsVisibility, setGoogleMapsVisibility] = useState(false);
  const isMobile = useResponsive('down', 'sm');
  const dispatch = useDispatch();
  const { sites, error, responseMessage, siteEditFormVisibility, siteAddFormVisibility } =
    useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  // for filtering sites
  const isFiltered = filterName !== '' || !!filterStatus.length;

  const toggleChecked = async () => {
    setChecked((value) => !value);
    if (checked || siteEditFormVisibility) {
      dispatch(setSiteFormVisibility(false));
      enqueueSnackbar(Snacks.SITE_CLOSE_CONFIRM, {
        variant: 'warning',
      });
      setCardActiveIndex(null);
      setIsExpanded(false);
    } else {
      dispatch(setSiteFormVisibility(true));
      setCardActiveIndex(null);
      setIsExpanded(false);
    }
  };

  // -----------------------Filtering----------------------------

  const handleFilterName = (e) => {
    setFilterName(e.target.value);
  };
  console.log('filterName', filterName);
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

  // ------------------------------------------------------------
  const toggleCancel = () => {
    dispatch(setSiteFormVisibility(false));
    setChecked(false);
  };

  const handleGoogleMapsVisibility = () => {
    setGoogleMapsVisibility(!googleMapsVisibility);
  };

  const handleActiveCard = (index) => {
    setCardActiveIndex(index);
  };
  const handleExpand = (index) => {
    setIsExpanded(true);
  };

  useEffect(() => {
    if (!siteAddFormVisibility && !siteEditFormVisibility) {
      dispatch(getSites(customer._id));
    }
  }, [dispatch, customer, siteAddFormVisibility, siteEditFormVisibility]); // checked is also included

  const isNotFound = !sites.length && !siteAddFormVisibility && !siteEditFormVisibility;

  // conditions for rendering the contact view, edit, and add forms
  const shouldShowSiteView = isExpanded && !siteEditFormVisibility && !siteAddFormVisibility;
  const shouldShowSiteEdit = siteEditFormVisibility && !siteAddFormVisibility;
  const shouldShowSiteAdd = siteAddFormVisibility && !siteEditFormVisibility;

  return (
    <>
      {/* <Stack alignItems="flex-end" sx={{ mt: 4, padding: 2 }}></Stack> */}
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ fontSize: '12px', color: 'text.disabled' }}
          >
            <BreadcrumbsLink to={PATH_DASHBOARD.customer.list} name="Customers" />
            <BreadcrumbsLink to={PATH_DASHBOARD.customer.view} name={customer.name} />
            <BreadcrumbsLink
              to={PATH_DASHBOARD.customer.contacts}
              name={
                <Stack>
                  {!siteAddFormVisibility && !siteEditFormVisibility && !isExpanded && 'Sites'}
                  {siteEditFormVisibility ? `Edit ${site?.name}` : isExpanded && site?.name}
                  {siteAddFormVisibility && !isExpanded && 'New Site Form'}
                </Stack>
              }
            />
          </Breadcrumbs>
        </Grid>
        <AddButtonAboveAccordion
          name={BUTTONS.NEWSITE}
          toggleChecked={toggleChecked}
          FormVisibility={siteAddFormVisibility}
          toggleCancel={toggleCancel}
          disabled={siteEditFormVisibility}
        />
      </Grid>

      <Grid container spacing={1} direction="row" justifyContent="flex-start">
        {sites.length > 0 && (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={4}
            sx={{ display: siteAddFormVisibility && isMobile && 'none' }}
          >
            {sites.length > 5 && (
              <Grid item md={12}>
                <SearchInput
                  searchFormVisibility={siteAddFormVisibility || siteEditFormVisibility}
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
              snap
              snapOffset={100}
              onClick={(e) => e.stopPropagation()}
              snapAlign="start"
              contacts={sites.length}
              disabled={siteEditFormVisibility || siteAddFormVisibility}
            >
              <Grid container spacing={1} justifyContent="flex-start" direction="column">
                {dataFiltered.map((Site, index) => {
                  const borderTopVal = index !== 0 ? '0px solid white' : '';
                  return (
                    <>
                      {index !== activeIndex && (
                        <Grid
                          item
                          key={index}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={4}
                          display={{ xs: 'flex', lg: 'block' }}
                          onClick={() => {
                            if (!siteEditFormVisibility && !siteAddFormVisibility) {
                              handleActiveCard(index);
                              handleExpand(index);
                            }
                          }}
                          sx={{
                            width: { xs: '100%', lg: '100%' },
                          }}
                        >
                          <StyledCardWrapper
                            condition1={activeCardIndex !== index}
                            condition2={activeCardIndex === index}
                            isMobile={isMobile}
                          >
                            <CardActionArea
                              active={activeIndex === index}
                              disabled={siteEditFormVisibility || siteAddFormVisibility}
                            >
                              <Link
                                underline="none"
                                disabled={siteEditFormVisibility || siteAddFormVisibility}
                                onClick={async () => {
                                  await dispatch(getSite(customer._id, Site._id));
                                  setOpenSite(true);
                                  if (!isExpanded && !siteAddFormVisibility) {
                                    handleActiveCard(!isExpanded ? index : null);
                                    handleExpand(index);
                                    setSiteFormVisibility(!siteAddFormVisibility);
                                  } else if (isExpanded && site && !siteAddFormVisibility) {
                                    handleExpand(index);
                                  } else {
                                    setIsExpanded(false);
                                    index = null;
                                  }
                                }}
                              >
                                <Grid
                                  container
                                  direction="row"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                >
                                  {!isMobile && (
                                    <AvatarSection
                                      // name={fullName[index]}
                                      image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                                      isSite="true"
                                    />
                                  )}
                                  <DetailsSection
                                    content={Site.name}
                                    content2={Site?.address?.city ? Site?.address?.city : <br />}
                                    content3={Site?.website ? Site?.website : <br />}
                                  />
                                </Grid>
                              </Link>
                            </CardActionArea>
                          </StyledCardWrapper>
                        </Grid>
                      )}
                    </>
                  );
                })}
              </Grid>
            </StyledScrollbar>
          </Grid>
        )}

        {/* Google Maps View */}
        {isMobile && googleMapsVisibility && (
          <Grid item md={12}>
            <Grid container direction="row" gap={1}>
              <Card>
                <CardActionArea>
                  {site?.lat && site?.long && (
                    <GoogleMaps
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
        <GridBaseViewForm item lg={sites.length === 0 ? 12 : 8}>
          {shouldShowSiteView && (
            <CardBase>
              <SiteViewForm
                currentSite={site}
                handleMap={() => {
                  handleGoogleMapsVisibility(true);
                }}
                setIsExpanded={setIsExpanded}
              />
              <Grid item lg={12} spacing={2}>
                {!isMobile && (
                  <Grid container direction="row" gap={1}>
                    <Grid item md={12}>
                      <Card>
                        <CardActionArea>
                          {site?.lat && site?.long && (
                            <GoogleMaps
                              lat={site?.lat ? site.lat : 0}
                              lng={site?.long ? site.long : 0}
                            />
                          )}
                        </CardActionArea>
                      </Card>
                    </Grid>

                    <Grid item md={12}>
                      <Card>
                        <CardActionArea>
                          <CardMedia
                            component={SiteCarousel}
                            image={<SiteCarousel />}
                            alt={sites[activeIndex]?.name}
                          />
                        </CardActionArea>
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

        <Grid item lg={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>
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

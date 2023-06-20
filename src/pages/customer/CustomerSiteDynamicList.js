import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { Stack, Card, CardMedia, Grid, CardActionArea, Link } from '@mui/material';
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
import { TableNoData } from '../../components/table';
import AddButtonAboveAccordion from '../components/AddButtonAboveAcoordion';
import GoogleMaps from '../../assets/GoogleMaps';
import useResponsive from '../../hooks/useResponsive';
import {
  getSites,
  deleteSite,
  getSite,
  setSiteFormVisibility,
  setSiteEditFormVisibility,
} from '../../redux/slices/customer/site';
import SiteAddForm from './site/SiteAddForm';
import SiteEditForm from './site/SiteEditForm';
import DetailsSection from '../components/sections/DetailsSection';
import AvatarSection from '../components/sections/AvatarSection';
import SiteViewForm from './site/SiteViewForm';
import BreadcrumbsProducer from '../components/BreadcrumbsProducer';

// ----------------------------------------------------------------------

export default function CustomerSiteList(defaultValues = { lat: 0, long: 0 }) {
  const [checked, setChecked] = useState(false);
  const [openSite, setOpenSite] = useState(false);
  const { site } = useSelector((state) => state.site);
  // const [site, setCurrentSiteData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCardIndex, setCardActiveIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [googleMapsVisibility, setGoogleMapsVisibility] = useState(false);
  const isMobile = useResponsive('down', 'sm');
  const dispatch = useDispatch();
  const {
    sites,
    isLoading,
    error,
    initial,
    responseMessage,
    siteEditFormVisibility,
    siteAddFormVisibility,
  } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);

  const toggleChecked = async () => {
    setChecked((value) => !value);
    if (checked || siteEditFormVisibility) {
      dispatch(setSiteEditFormVisibility(false));
      // enqueueSnackbar('Please close the form before opening a new one', {
      //   variant: 'warning',
      // });
      dispatch(setSiteFormVisibility(true));
      setIsExpanded(false);
    } else {
      dispatch(setSiteFormVisibility(true));
      setCardActiveIndex(null);
      setIsExpanded(false);
    }
  };

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
  const shouldShowSiteView = isExpanded && !siteEditFormVisibility;
  const shouldShowSiteEdit = siteEditFormVisibility && !siteAddFormVisibility;
  const shouldShowSiteAdd = siteAddFormVisibility && !siteEditFormVisibility;

  return (
    <>
      <Stack alignItems="flex-end" sx={{ mt: 4, padding: 2 }}>
        <AddButtonAboveAccordion
          name="New Site"
          toggleChecked={toggleChecked}
          FormVisibility={siteAddFormVisibility}
          toggleCancel={toggleCancel}
        />
        <BreadcrumbsProducer
          underline="none"
          step={1}
          step2
          step3
          step4
          path={PATH_DASHBOARD.customer.list}
          name="Customers"
          path2={PATH_DASHBOARD.customer.view}
          name2={customer.name}
          name3="Sites"
          path3={PATH_DASHBOARD.customer.sites}
          path4={PATH_DASHBOARD.customer}
          name4={
            <Stack>
              {siteEditFormVisibility
                ? `Edit ${site.name}`
                : isExpanded && site.name}
              {siteAddFormVisibility && !isExpanded && 'New Site Form'}
            </Stack>
          }
        />
      </Stack>

      <Grid container spacing={1} direction="row" justifyContent="flex-start">
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          sx={{ display: siteAddFormVisibility && isMobile && 'none' }}
        >
          <StyledScrollbar
            snap
            snapOffset={100}
            onClick={(e) => e.stopPropagation()}
            snapAlign="start"
            contacts={sites.length}
            disabled={siteEditFormVisibility}
          >
            <Grid container justifyContent="flex-start" direction="column" gap={1}>
              {sites.map((Site, index) => {
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
                          if (!siteEditFormVisibility) {
                            handleActiveCard(index);
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
                            disabled={siteEditFormVisibility}
                          >
                            <Link
                              underline="none"
                              disabled={siteEditFormVisibility}
                              onClick={async () => {
                                await dispatch(getSite(customer._id,Site._id))
                                setOpenSite(true);
                                if (!isExpanded && !siteAddFormVisibility) {
                                  handleExpand(index);
                                  setSiteFormVisibility(!siteAddFormVisibility);
                                } else if (
                                  isExpanded &&
                                  site  &&
                                  !siteAddFormVisibility
                                ) {
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
                                  content={site.name}
                                  content2={site?.address?.city ? site?.address?.city : <br />}
                                  content3={site?.website ? site?.website : <br />}
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

        {/* Google Maps View */}
        {isMobile && googleMapsVisibility && (
          <Grid item md={12}>
            <Grid container direction="row" gap={1}>
              <Card>
                <CardActionArea>
                  {site.lat && site.long && (
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
        <GridBaseViewForm item lg={8}>
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
                          {site.lat && site.long && (
                            <GoogleMaps
                              lat={site.lat ? site.lat : 0}
                              lng={site.long ? site.long : 0}
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

import { Helmet } from 'react-helmet-async';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getNotes, getNote } from '../../../redux/slices/customer/note';

// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// _mock_
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { Cover } from '../../components/Defaults/Cover';
import NoteViewForm from './NotesViewForm';
// ----------------------------------------------------------------------

export default function NoteViewPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(getNote(id));
  }, [dispatch, id]);
  const { note } = useSelector((state) => state.note);
  const { themeStretch } = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('note-edit');

  const TABS = [
    {
      value: 'note-edit',
      label: 'Basic Info',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <NoteViewForm />,
    },
    {
      value: 'configuration',
      label: 'Configuration',
      icon: <Iconify icon="eva:settings-2-outline" />,
    },
    {
      value: 'service-history',
      label: 'Service History',
      icon: <Iconify icon="eva:clock-outline" />,
    },
    {
      value: 'repair-history',
      label: 'Repair History',
      icon: <Iconify icon="eva:archive-outline" />,
    },
  ];

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Note View"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          {
            name: 'Note',
            href: PATH_DASHBOARD.note.list,
          },
          { name: 'View' },
        ]}
      />
      <Card
        sx={{
          mb: 3,
          height: 280,
          position: 'relative',
        }}
      >
        <Cover name={note?.name} />

        <Tabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            '& .MuiTabs-flexContainer': {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {/* <Button
                  size ="medium"
                  color ="secondary"
                  variant ="contained"
                  // href = {currentNote.image === undefined ? '' : `localhost:5000/${currentNote.image}`}
                  >
                    Edit Note
          </Button>  */}
      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box key={tab.value}>
              {' '}
              {tab.component ? (
                tab.component
              ) : (
                <img src="/assets/background/construction.jpg" alt="UNDER CONSTRUCTION" />
              )}{' '}
            </Box>
          )
      )}
    </Container>
  );
}

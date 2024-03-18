import Iconify from '../../../components/iconify';

const TABS = [
    {
        value: 'customer',
        label: 'Customer Info',
        icon: <Iconify icon="mdi:badge-account" />,
    },
    {
        value: 'sites',
        label: 'Sites',
        icon: <Iconify icon="mdi:map-legend" />,
    },
    {
        value: 'contacts',
        label: 'Contacts',
        icon: <Iconify icon="mdi:account-multiple" />,
    },
    {
        value: 'notes',
        label: 'Notes',
        icon: <Iconify icon="mdi:note-multiple" />,
    },
    {
        value: 'documents',
        label: 'Documents',
        icon: <Iconify icon="mdi:folder-open" />,
    },
    {
        value: 'machines',
        label: 'Machines',
        icon: <Iconify icon="mdi:greenhouse" />,
    },
];

export default TABS
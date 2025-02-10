import { PATH_CRM, PATH_SETTING } from '../../../../routes/paths';

export const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_SETTING.security.users.profile,
  },
  // {
  //   label: 'Change Password',
  //   linkTo: PATH_SETTING.security.users.password,
  // },
  {
    label: 'Organization',
    linkTo: (id) => PATH_CRM.customers.view(id),
  },
];

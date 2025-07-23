import * as Yup from 'yup';

export const normalizeColor = (color) => {
  if (!color) return '';
  const trimmed = color.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export const isValidColor = (color) => {
  if (!color) return false;
  const s = new Option().style;
  const normalized = normalizeColor(color);
  s.color = '';
  s.color = normalized;
  return s.color !== '';
};

export const TicketCollectionSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required('Name is required!'),
  icon: Yup.string().max(50).required('Icon is required!'),
  color: Yup.string()
    .nullable()
    .notRequired()
    .test('is-valid-color', 'Invalid color!', (value) => {
      if (!value) return true;
      const normalized = normalizeColor(value);
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || isValidColor(normalized);
    }),
  description: Yup.string().max(5000),
  isActive: Yup.boolean(),
  isDefault: Yup.boolean(),
  displayOrderNo: Yup.number()
    .typeError('Display Order No. must be a number')
    .nullable()
    .transform((_, val) => (val !== '' ? Number(val) : null)),
  slug: Yup.string().min(0).max(50).matches(/^(?!.*\s)[\S\s]{0,50}$/, 'Slug field cannot contain blankspaces'),
});
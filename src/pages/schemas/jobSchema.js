import * as yup from 'yup';

// Constants
const PROFILE_SHAPES = ['C', 'U', 'R'];
const LABEL_DIRECTIONS = ['LABEL_NRM', 'LABEL_INV'];
const UNITS_OF_LENGTH = ['MILLIMETRE', 'INCH'];
const CSV_VERSIONS = ['1.0', '2.0'];

// Regex patterns
const COMPONENT_LABEL_PATTERN = /^[a-zA-Z0-9-_.+:\s]{1,}$/;
const MATERIAL_GRADE_PATTERN = /^[a-zA-Z0-9]{1,}$/;
const PROFILE_NAME_PATTERN = /^[^\s,'"]{1,}$/;
const DECIMAL_PRECISION_3_PATTERN = /^\d+(\.\d{1,3})?$/;
const DECIMAL_PRECISION_2_PATTERN = /^\d+(\.\d{1,2})?$/;

// Helper function to validate comma-separated offset values
const validateOffsets = (value, context) => {
  if (!value) return true;

  const componentLength = context.from[1].value.length;
  if (Number.isNaN(componentLength)) return true;

  const offsets = value.split(',').map((offset) => offset.trim()).filter(e => e !== '');
  return offsets.every((offset) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(offset)) return false;
    const numericOffset = parseFloat(offset);
    return !Number.isNaN(numericOffset) && numericOffset >= 0 && numericOffset <= parseFloat(componentLength);
  });
};

// Reusable validation tests
const decimalPrecisionTest = (pattern) => ({
  name: 'decimal-precision',
  message: 'Too many decimal places',
  test: (value) => {
    if (!value && value !== 0) return true;
    return pattern.test(value.toString());
  },
});

// Common component field validations
const createComponentFieldValidations = () => ({
  label: yup
    .string()
    .required('Component Label is required'),

  labelDirection: yup
    .string()
    .required('Label Direction is required')
    .oneOf(LABEL_DIRECTIONS, 'Invalid label direction'),

  quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number')
    .max(10000, 'Quantity exceeds maximum value'),

  length: yup
    .number()
    .required('Length is required')
    .positive('Length must be positive')
    .test(decimalPrecisionTest(DECIMAL_PRECISION_3_PATTERN)),

  // V2.0 specific fields - conditionally required based on CSV version
  // profileShape: yup.string().when('$csvVersion', {
  //   is: '2.0',
  //   then: (schema) =>
  //     schema
  //       .required('Profile Shape is required for CSV V2.0')
  //       .oneOf(PROFILE_SHAPES, 'Invalid profile shape'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // webWidth: yup.number().when('$csvVersion', {
  //   is: '2.0',
  //   then: (schema) =>
  //     schema.required('Web Width is required for CSV V2.0').positive('Web Width must be positive'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // flangeHeight: yup.number().when('$csvVersion', {
  //   is: '2.0',
  //   then: (schema) =>
  //     schema
  //       .required('Flange Height is required for CSV V2.0')
  //       .positive('Flange Height must be positive'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // materialThickness: yup.number().when('$csvVersion', {
  //   is: '2.0',
  //   then: (schema) =>
  //     schema
  //       .required('Material Thickness is required for CSV V2.0')
  //       .positive('Material Thickness must be positive')
  //       .test(decimalPrecisionTest(DECIMAL_PRECISION_2_PATTERN)),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // materialGrade: yup.string().when('$csvVersion', {
  //   is: '2.0',
  //   then: (schema) =>
  //     schema
  //       .required('Material Grade is required for CSV V2.0')
  //       .matches(MATERIAL_GRADE_PATTERN, 'Material grade can only contain alphanumeric characters'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // position: yup
  //   .object({
  //     startX: yup
  //       .number()
  //       .required('Start X is required')
  //       .test(decimalPrecisionTest(DECIMAL_PRECISION_2_PATTERN)),

  //     startY: yup
  //       .number()
  //       .required('Start Y is required')
  //       .test(decimalPrecisionTest(DECIMAL_PRECISION_2_PATTERN)),

  //     endX: yup
  //       .number()
  //       .required('End X is required')
  //       .test(decimalPrecisionTest(DECIMAL_PRECISION_2_PATTERN)),

  //     endY: yup
  //       .number()
  //       .required('End Y is required')
  //       .test(decimalPrecisionTest(DECIMAL_PRECISION_2_PATTERN)),
  //   })
  //   .when('$csvVersion', {
  //     is: '2.0',
  //     then: (schema) => schema.required('Position coordinates are required for CSV V2.0'),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),

  operations: yup
    .array()
    .of(
      yup.object({
        operationType: yup.string().required('Operation Type is required'),
        offset: yup
          .string()
          .required('Offset is required')
          .test(
            'valid-offsets',
            'Offsets must be valid numbers and cannot exceed component length',
            validateOffsets
          ),
      })
    )
    .min(1, 'At least one operation is required'),
});

// Create the component schema once
const componentFieldValidations = createComponentFieldValidations();

// Main validation schema
export const jobSchema = yup
  .object({
    csvVersion: yup
      .string()
      .required('CSV Version is required')
      .oneOf(CSV_VERSIONS, 'Invalid CSV version'),

    unitOfLength: yup
      .string()
      .required('Unit of Length is required')
      .oneOf(UNITS_OF_LENGTH, 'Invalid unit of length'),

    profileName: yup
      .string()
      .required('Profile Name is required')
      .matches(PROFILE_NAME_PATTERN, 'Profile name cannot contain spaces, commas, or quotes'),

    profileDescription: yup.string().notRequired().max(100, 'Profile description is too long'),

    frameset: yup.string().notRequired(),

    components: yup
      .array()
      .min(1, 'At least one component is required'),
  })
  .required();

// Reuse the component validations for the component schema
export const jobComponentSchema = yup.object(componentFieldValidations);

// Usage example comment preserved
// When using the schema:
//
// const formMethods = useForm({
//   resolver: yupResolver(machineJobSchema),
//   context: {
//     csvVersion: watch('csvVersion') // This will be available in validation context
//   },
//   defaultValues: { ... }
// });

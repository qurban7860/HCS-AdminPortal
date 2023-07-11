import * as Yup from 'yup';

// @root - DocumentEditForm
export const EditCustomerDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(50),
  description: Yup.string().max(10000),
  // image: Yup.mixed().required("Image Field is required!"),
  isActive: Yup.boolean(),
});

export const LicenseSchema = Yup.object().shape({
    licenseKey: Yup.string().max(1000).required('License key is required!') ,
    licenseDetail: Yup.string().max(10000).required('License detail is required!'),
    isDisabled : Yup.boolean(),
  });
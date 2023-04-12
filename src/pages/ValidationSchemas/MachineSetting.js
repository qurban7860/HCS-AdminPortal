const MachineSettingSchema = Yup.object().shape({
    techParamValue: Yup.string().max(20),
    isDisabled : Yup.boolean(),
  });
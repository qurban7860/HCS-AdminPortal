export const machineLogTypeFormats = [
  {
    type: "ERP",
    disabled: false,
    versions: ["v1.5.X", "v1.4.X", "v1.1.66"],
    formats: {
      "v1.1.66": ["date", "operator", "coilBatchName", "ccThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time"],
      "v1.4.X": ["date", "operator", "coilBatchName", "ccWidth", "coilThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time", "componentWeight"],
      "v1.5.X": ["timestamp", "operator", "coilBatchName", "coilWidth", "coilThickness", "coilLength", "frameSet", "componentLabel", "flangeHeight", "webWidth", "profileShape", "componentLength", "waste", "time", "mode", "measurementUnit", "componentWeight", "lineSpeed", "componentGUID", "componentType"],
    },
    tableColumns: [
      { id: 'date', label: 'Date', alwaysShow: true, defaultShow: true },
      { id: 'machineSerialNo', label: 'Machine', alwaysShow: true, defaultShow: true, page: 'allMachineLogs' },
      { id: '_id', label: 'Log ID' },
      { id: 'componentLabel', label: 'Label', defaultShow: true, tooltip: true, fullLabel: 'Component Label', searchable: true },
      { id: 'frameSet', label: 'Frame Set', defaultShow: true, searchable: true },
      { id: 'componentLength', label: 'Length', baseUnit: 'm', alwaysShow: true, tooltip: true, fullLabel: 'Produced Length', defaultShow: true, numerical: true, convertable: true },
      { id: 'waste', label: 'Waste', baseUnit: 'm', alwaysShow: true, defaultShow: true, numerical: true, convertable: true },
      { id: 'coilLength', label: 'Rem. Coil', baseUnit: 'm', defaultShow: true, tooltip: true, fullLabel: 'Remaining Coil Length', numerical: true, convertable: true },
      { id: 'flangeHeight', label: 'Flange', baseUnit: 'mm', defaultShow: true, tooltip: true, fullLabel: 'Flange Height', numerical: true, convertable: true },
      { id: 'webWidth', label: 'Web', baseUnit: 'mm', defaultShow: true, tooltip: true, fullLabel: 'Web Width', numerical: true, convertable: true },
      { id: 'profileShape', label: 'P.S', defaultShow: true, tooltip: true, fullLabel: 'Profile Shape', searchable: true },
      { id: 'componentWeight', label: 'Weight', baseUnit: 'kg', tooltip: true, fullLabel: 'Component Weight', numerical: true, convertable: true },
      { id: 'coilBatchName', label: 'C.Batch', tooltip: true, fullLabel: 'Coil Batch Name', searchable: true },
      { id: 'coilThickness', label: 'C.Thickness', baseUnit: 'mm', tooltip: true, fullLabel: 'Coil Thickness', numerical: true, convertable: true },
      { id: 'coilWidth', label: 'C.Width', baseUnit: 'mm', tooltip: true, fullLabel: 'Coil Width', numerical: true, convertable: true },
      { id: 'lineSpeed', label: 'L.S (%)', baseUnit: '%', tooltip: true, fullLabel: 'Line Speed' },
      { id: 'mode', label: 'Mode', searchable: true },
      { id: 'time', label: 'Time', baseUnit: 'msec', numerical: true, convertable: true },
      { id: 'operator', label: 'Operator', searchable: true },
      { id: 'componentGUID', label: 'GUID', searchable: true, tooltip: true, fullLabel: 'Component GUID' },
      { id: 'componentType', label: 'Type', searchable: true, tooltip: true, fullLabel: 'Component Type', defaultShow: true },
      { id: 'jobGUID', label: 'Job GUID', searchable: true },
      { id: 'cloudComponentId', label: 'Cloud Component', searchable: true },
      { id: 'cloudJobId', label: 'Cloud Job', searchable: true },
    ],
  },
  {
    type: "PRODUCTION",
    disabled: true,
    versions: ["v1.4.5"],
    formats: {
      "v1.4.5": ["date", "frameSet", "componentName", "componentLength", "flangeHeight", "webWidth", "unitOfMeasurement", "muClassifier"],
    },
    tableColumns: [
      { id: 'date', label: 'Date', alwaysShow: true, defaultShow: true },
      { id: 'frameSet', label: 'Frame Set', alwaysShow: true, defaultShow: true },
      { id: 'componentName', label: 'Component Name', defaultShow: true },
      { id: 'componentLength', label: 'Length', defaultShow: true, numerical: true },
      { id: 'waste', label: 'Waste', alwaysShow: true, defaultShow: true, numerical: true },
      { id: 'flangeHeight', label: 'Flange Height', numerical: true },
      { id: 'webWidth', label: 'Web Width', numerical: true },
      { id: 'muClassifier', label: 'MU Classifier' },
    ],
  },
  {
    type: "COIL",
    disabled: true,
    versions: ["v1.4.5", "v1.1.X"],
    formats: {
      "v1.1.X": ["date", "coilBatchName", "coilLength", "coilLengthUnit", "coilThickness", "coilThicknessUnit", "coilWidth", "coilWeight", "coilDensity"],
      "v1.4.5": ["date", "coilBatchName", "coilLength", "coilLengthUnit", "coilThickness", "coilThicknessUnit", "coilWidth", "coilWeight", "coilDensity", "operator"],
    },
    tableColumns: [
      { id: 'date', label: 'Date', alwaysShow: true, defaultShow: true },
      { id: 'coilBatchName', label: 'Coil Batch Name', alwaysShow: true, defaultShow: true },
      { id: 'coilLength', label: 'Coil Length', alwaysShow: true, defaultShow: true, numerical: true },
      { id: 'coilThickness', label: 'Coil Thickness', defaultShow: true, numerical: true },
      { id: 'coilWeight', label: 'Coil Weight', baseUnit: 'kg', tooltip: true, defaultShow: true, numerical: true },
      { id: 'coilWidth', label: 'Coil Width', numerical: true },
      { id: 'coilDensity', label: 'Coil Density', numerical: true },
      { id: 'operator', label: 'Oerator' },
    ],
  },
  {
    type: "TOOLCOUNT",
    disabled: true,
  },
  {
    type: "WASTE",
    disabled: true,
  },
]

export const machineLogGraphTypes = [
  {
    name: "Meterage Produced Graph",
    key: "length_and_waste"
  },
  {
    name: "Production Rate Graph",
    key: "productionRate"
  }
]
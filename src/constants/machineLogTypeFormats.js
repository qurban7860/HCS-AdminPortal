export const machineLogTypeFormats = [
  {
    type: "ERP",
    disabled: false,
    versions: ["v1.5.X", "v1.4.X", "v1.1.66"],
    formats: {
      "v1.1.66": ["date", "operator", "coilBatchName", "ccThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time"],
      "v1.4.X": ["date", "operator", "coilBatchName", "ccWidth", "coilThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time", "componentWeight"],
      "v1.5.X": ["timestamp", "operator", "coilBatchName", "coilWidth", "coilThickness", "coilLength", "frameSet", "componentLabel", "flangeHeight", "webWidth", "profileShape", "componentLength", "waste", "time", "mode", "measurementUnit", "componentWeight", "lineSpeed"],
    },
    tableColumns: [
      { id: 'date', label: 'Date', align: 'left' },
      { id: 'machineSerialNo', label: 'Machine', align: 'left' },
      { id: 'frameSet', label: 'Frame Set', align: 'left' },
      { id: 'componentLabel', label: 'Component Label', align: 'left' },
      { id: 'componentLength', label: 'Length', align: 'left' },
      { id: 'waste', label: 'Waste', align: 'left' },
      { id: 'flangeHeight', label: 'Flange Height', align: 'left' },
      { id: 'webWidth', label: 'Web Width', align: 'left' },
      { id: 'profileShape', label: 'Profile Shape', align: 'left' },
      { id: 'coilLength', label: 'Coil Length', align: 'left' },
      // { id: 'createdBy.name', label: 'Created By', align: 'left' },
      // { id: 'createdAt', label: 'Created At', align: 'right' },
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
      { id: 'date', label: 'Date', align: 'left' },
      { id: 'frameSet', label: 'Frame Set', align: 'left' },
      { id: 'componentName', label: 'Component Name', align: 'left' },
      { id: 'componentLength', label: 'Length', align: 'left' },
      { id: 'waste', label: 'Waste', align: 'left' },
      // { id: 'createdBy.name', label: 'Created By', align: 'left' },
      // { id: 'createdAt', label: 'Created At', align: 'right' },
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
      { id: 'date', label: 'Date', align: 'left' },
      { id: 'coilBatchName', label: 'Coil Batch Name', align: 'left' },
      { id: 'coilLength', label: 'Coil Length', align: 'left' },
      { id: 'coilThickness', label: 'Coil Thickness', align: 'left' },
      { id: 'coilWeight', label: 'Coil Weight', align: 'left' },
      // { id: 'createdBy.name', label: 'Created By', align: 'left' },
      // { id: 'createdAt', label: 'Created At', align: 'right' },
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
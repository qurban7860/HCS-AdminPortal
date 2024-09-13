export const machineLogTypeFormats = [
  {
    type: "ERP",
    disabled: false,
    versions: ["v1.4.X", "v1.1.66"],
    formats: {
      "v1.1.66": ["date", "operator", "coilBatchName", "ccThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time"],
      "v1.4.X": ["date", "operator", "coilBatchName", "ccWidth", "coilThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time", "componentWeight"],
    },
  },
  {
    type: "PRODUCTION",
    disabled: false,
    versions: ["v1.4.5"],
    formats: {
      "v1.4.5": ["date", "frameSet", "componentName", "componentLength", "flangeHeight", "webWidth", "unitOfMeasurement", "muClassifier"],
    },
  },
  {
    type: "COIL",
    disabled: false,
    versions: ["v1.4.5", "v1.1.X"],
    formats: {
      "v1.1.X": ["date", "coilBatchName", "coilLength", "coilLengthUnit", "coilThickness", "coilThicknessUnit", "coilWidth", "coilWeight", "coilDensity"],
      "v1.4.5": ["date", "coilBatchName", "coilLength", "coilLengthUnit", "coilThickness", "coilThicknessUnit", "coilWidth", "coilWeight", "coilDensity", "operator"],
    },
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
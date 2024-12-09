export const patientDataMappings = {
  patientName: {
    tag: "ClinicalDocument recordTarget patientRole patient name",
  },
  patientBirthDate: {
    tag: "ClinicalDocument recordTarget patientRole patient birthTime",
    attribute: "value",
  },
  patientAddress: { tag: "ClinicalDocument recordTarget patientRole addr" },
};

export const doctorDataMapping = {
  name: {
    tag: "ClinicalDocument associatedEntity  name",
  },
  tel: {
    tag: "ClinicalDocument associatedEntity telecom",
    attribute: "value",
  },
  address: { tag: "ClinicalDocument associatedEntity addr" },
};

export const medicationDataMapping = {
  procedure: {
    tag: "ClinicalDocument component structuredBody component section entry act entryRelationship procedure participant participantRole playingEntity code",
    attribute: "displayName",
  },
};

import { doctorDataMapping, medicationDataMapping, patientDataMappings } from "../constants";
import { getValueFromDocAndMapping } from "../utils";
import { setDoc } from "../state";

export const getDoc = async (id: string) => {
  const data = await (await fetch(`http://localhost:8080/docs/${id}`)).text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "application/xml");
  setDoc(doc);
  return {
    patientData: {
      Name: getValueFromDocAndMapping(doc, patientDataMappings.patientName),
      Birthdate: getValueFromDocAndMapping(
        doc,
        patientDataMappings.patientBirthDate,
      ),
      Address: getValueFromDocAndMapping(
        doc,
        patientDataMappings.patientAddress,
      ),
    },
    doctorData: {
      Name: getValueFromDocAndMapping(doc, doctorDataMapping.name),
      Tel: getValueFromDocAndMapping(doc, doctorDataMapping.tel),
      Address: getValueFromDocAndMapping(doc, doctorDataMapping.address),
    },
    reportData: {
      "Procedure": getValueFromDocAndMapping(doc, medicationDataMapping.specimenType),
      "Result": getValueFromDocAndMapping(doc, medicationDataMapping.result)
    }
  };
};

export const getDocIds = async () => {
  const data = (await (
    await fetch("http://localhost:8080/doc-ids")
  ).json()) as { [key: string]: string };
  return data;
};

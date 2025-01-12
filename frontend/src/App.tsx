import "./App.css";
import { getDocIds, getDoc, deleteDoc, updateDoc } from "./http";
import { doc as inMemoryDoc, setDoc } from "./state"
import {
  createSignal,
  createResource,
  For,
  createEffect,
  Show,
} from "solid-js";
import { ValueContainer } from "./components/ValueContainer";
import { updateValueFromDocAndMapping } from "./utils";
import { doctorDataMapping, medicationDataMapping, patientDataMappings } from "./constants";

function App() {
  const [docId, setDocId] = createSignal<string>();
  const [docIds, { refetch }] = createResource(getDocIds);
  const [doc, { mutate, refetch: refetchDoc }] = createResource(docId, getDoc);
  const updateDocuemnt = () => {
    setDoc((prev) => {
      updateValueFromDocAndMapping(prev!, patientDataMappings.patientName, doc()!.patientData.Name!)
      updateValueFromDocAndMapping(
        prev!,
        patientDataMappings.patientBirthDate,
        doc()!.patientData.Birthdate!)
      updateValueFromDocAndMapping(
        prev!,
        patientDataMappings.patientAddress,
        doc()!.patientData.Address!)
      updateValueFromDocAndMapping(
        prev!,
        doctorDataMapping.name,
        doc()!.doctorData.Name!)
      updateValueFromDocAndMapping(
        prev!,
        doctorDataMapping.tel,
        doc()!.doctorData.Tel!)
      updateValueFromDocAndMapping(
        prev!,
        doctorDataMapping.address,
        doc()!.doctorData.Address!)
      updateValueFromDocAndMapping(
        prev!,
        medicationDataMapping.specimenType,
        doc()!.reportData.Procedure!)
      updateValueFromDocAndMapping(
        prev!,
        medicationDataMapping.specimenType,
        doc()!.reportData.Procedure!)
      return prev;
    })
    updateDoc(docId()!, inMemoryDoc()!)
    refetchDoc()
  }
  createEffect(() => {
    if (docIds.state === "ready") {
      setDocId(Object.keys(docIds())[0]);
    }
  }, docIds.state);
  return (
    <main>
      <h1>HL7 V3 Message Viewer</h1>

      <div id="ui">
        <Show when={docIds.state === "ready"}>
          <select onchange={(e) => setDocId(e.currentTarget.value)}>
            <For each={Object.entries(docIds()!)}>
              {(doc) => <option value={doc[0]}>{doc[1]}</option>}
            </For>
          </select>
        </Show>

        <Show when={doc.state === "ready"}>
          <div id="data">
            <div id="patient-data">
              <h4>Patient Data</h4>
              <For each={Object.entries(doc()!.patientData)}>
                {(data) => (
                  <ValueContainer
                    label={data[0]}
                    onChange={(val) => {
                      mutate((a) => {
                        Object.defineProperty(a!.patientData, data[0], { value: val })
                        return a
                      })
                    }}
                  >
                    {data[1]}
                  </ValueContainer>
                )}
              </For>
            </div>
            <div id="doctor-data">
              <h4>Doctor Data</h4>
              <For each={Object.entries(doc()!.doctorData)}>
                {(data) => (
                  <ValueContainer
                    label={data[0]}
                    onChange={(val) => {
                      mutate((a) => {
                        Object.defineProperty(a!.doctorData, data[0], { value: val })
                        return a
                      })
                    }}
                  >
                    {data[1]}
                  </ValueContainer>
                )}
              </For>



            </div>
          </div>
          <div id="lab-data">
            <For each={Object.entries(doc()!.reportData)}>
              {(data) => (
                <ValueContainer
                  label={data[0]}
                  onChange={(val) => {
                    mutate((a) => {
                      Object.defineProperty(a!.patientData, data[0], { value: val })
                      return a
                    })
                  }}
                >
                  {data[1]}
                </ValueContainer>
              )}
            </For></div>
        </Show>
      </div>
      <div id="btn-container">
        <button
          onclick={() => {
            deleteDoc(docId()!);
            refetch();
          }}
        >
          Delete{" "}
        </button>
        <button onclick={updateDocuemnt}>Update </button>
      </div>
    </main>
  );
}

export default App;

import "./App.css";
import { getDocIds, getDoc, deleteDoc } from "./http";
import {
  createSignal,
  createResource,
  For,
  Show,
  createEffect,
} from "solid-js";
import { getValueFromDocAndMapping } from "./utils";
import { medicationDataMapping, patientDataMappings } from "./constants";
import { ValueContainer } from "./components/ValueContainer";

function App() {
  const [docId, setDocId] = createSignal<string>();
  const [docIds, { refetch }] = createResource(getDocIds);
  const [doc, { mutate }] = createResource(docId, getDoc);
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
              <p>
                <strong>Name:</strong>{" "}
                <span id="name">
                  {getValueFromDocAndMapping(
                    doc()!,
                    patientDataMappings.patientName,
                  )}
                </span>
              </p>
              <ValueContainer label="Name" onChange={() => { }}>{getValueFromDocAndMapping(doc()!, patientDataMappings.patientName)}</ValueContainer>
              <p>
                <strong>Birthdate:</strong>{" "}
                <span id="birthdate">
                  {getValueFromDocAndMapping(
                    doc()!,
                    patientDataMappings.patientBirthDate,
                  )}
                </span>
              </p>
              <p>
                <strong>Address:</strong>{" "}
                <span id="address">
                  {getValueFromDocAndMapping(
                    doc()!,
                    patientDataMappings.patientAddress,
                  )}
                </span>
              </p>
            </div>
            <div id="doctor-data">
              <h4>Doctor Data</h4>
              <p>
                <strong>Name:</strong>
                <span id="name">
                  {getValueFromDocAndMapping(
                    doc()!,
                    patientDataMappings.patientName,
                  )}
                </span>
              </p>
              <p>
                <strong>Birthdate:</strong>{" "}
                <span id="birthdate">
                  {getValueFromDocAndMapping(
                    doc()!,
                    patientDataMappings.patientBirthDate,
                  )}
                </span>
              </p>
              <p>
                <strong>Address:</strong>{" "}
                <span id="address">
                  {getValueFromDocAndMapping(
                    doc()!,
                    patientDataMappings.patientAddress,
                  )}
                </span>
              </p>
            </div>
          </div>
          <div id="lab-data">
            <div>
              {getValueFromDocAndMapping(
                doc()!,
                medicationDataMapping.procedure,
              )}
            </div>
          </div>
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
        <button>Update </button>
      </div>
    </main>
  );
}

export default App;

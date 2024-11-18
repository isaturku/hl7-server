import './App.css'
import { getDoc, getDocIds } from './http/get-doc'
import { createSignal, createResource, For, Show } from 'solid-js'

function App() {
  const [docId, setDocId] = createSignal<string>();
  const [docIds] = createResource(getDocIds)
  const [doc] = createResource(docId, getDoc)
  return (
    <main>
      <h1>HL7 V3 Message Viewer</h1>

      <div id="ui">
        <Show when={docIds.state === "ready"} >
          <select onchange={(e) => setDocId(e.currentTarget.value)}>
            <For each={Object.entries(docIds()!)} >
              {(doc) => (<option value={doc[0]}>{doc[1]}</option>)}
            </For>

          </select>
        </Show>
        <div id="data">
          <div id="patient-data">
            <h4>Patient Data</h4>
            <p><strong>Name:</strong> <span id="name">{doc()?.querySelector("ClinicalDocument recordTarget patientRole patient name")}</span></p>
            <p><strong>Birthdate:</strong> <span id="birthdate">{doc()?.querySelector("ClinicalDocument recordTarget patientRole patient birthtime")}</span></p>
            <p><strong>Medication:</strong> <span id="medication"></span></p>
          </div>
          <div id="doctor-data">
            <h4>Doctor Data</h4>
            <p><strong>Name:</strong> <span id="name"></span></p>
            <p><strong>Birthdate:</strong> <span id="birthdate"></span></p>
            <p><strong>Medication:</strong> <span id="medication"></span></p>
          </div>
        </div>
      </div>
      <div id="btn-container">
        <button >Delete Medication</button>
        <button >Update </button>
      </div>
    </main>
  )
}

export default App

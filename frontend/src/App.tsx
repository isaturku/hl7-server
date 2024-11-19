import './App.css'
import { getDoc, getDocIds } from './http/get-doc'
import { createSignal, createResource, For, Show, createEffect } from 'solid-js'

function App() {
  const [docId, setDocId] = createSignal<string>();
  const [docIds] = createResource(getDocIds)
  const [doc] = createResource(docId, getDoc)
  createEffect(() => {
    setDocId(docIds()?.[0])
  }, docIds.state)
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
            <p><strong>Name:</strong> <span id="name">{doc()?.querySelector("")}</span></p>
            <p><strong>Birthdate:</strong> <span id="birthdate">{doc()?.querySelector("ClinicalDocument recordTarget patientRole patient birthTime")?.getAttribute("value")}</span></p>
            <p><strong>Address:</strong> <span id="address">{doc()?.querySelector("ClinicalDocument recordTarget patientRole addr")}</span></p>
          </div>
          <div id="doctor-data">
            <h4>Doctor Data</h4>
            <p><strong>Name:</strong> <span id="name"></span></p>
            <p><strong>Birthdate:</strong> <span id="birthdate"></span></p>
            <p><strong>Address:</strong> <span id="address"></span></p>
          </div>
        </div>
        <div id="lab-data">
          <Show when={doc.state === "ready"}>
            <div>{doc()?.querySelector("ClinicalDocument component structuredBody component section entry act entryRelationship procedure participant participantRole playingEntity code")?.getAttribute("displayName")}</div>
          </Show>
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

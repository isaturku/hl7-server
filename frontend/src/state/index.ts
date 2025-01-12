import { createSignal } from "solid-js";

export const [doc, setDoc] = createSignal<Document | undefined>(undefined)

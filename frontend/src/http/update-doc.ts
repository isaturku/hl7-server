export const updateDoc = (id: string, doc: Document) => {
  fetch(`http://localhost:8080/docs/${id}`, {
    method: "PATCH",
    body: doc.documentElement.outerHTML
  })
}

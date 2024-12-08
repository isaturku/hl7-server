export const deleteDoc = async (id: string) => {
  const data = await (
    await fetch(`http://localhost:8080/docs/${encodeURIComponent(id)}`, {
      method: "delete",
    })
  ).text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "application/xml");
  return doc;
};

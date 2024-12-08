export const getDoc = async (id: string) => {
  const data = await (await fetch(`http://localhost:8080/docs/${id}`)).text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "application/xml");
  return doc;
};

export const getDocIds = async () => {
  const data = (await (
    await fetch("http://localhost:8080/doc-ids")
  ).json()) as { [key: string]: string };
  return data;
};

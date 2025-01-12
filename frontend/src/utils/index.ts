export const getValueFromDocAndMapping = (
  doc: Document,
  mapping: { tag: string; attribute?: string },
) => {
  const element = doc.querySelector(mapping.tag);
  if (mapping.attribute) return element?.getAttribute(mapping.attribute);
  return element?.textContent;
};

export const updateValueFromDocAndMapping = (
  doc: Document,
  mapping: { tag: string; attribute?: string },
  value: string,
) => {
  const element = doc.querySelector(mapping.tag);
  console.log("asdf", element)
  if (mapping.attribute) element?.setAttribute(mapping.attribute, value);
  else element!.textContent = value;
  return doc;
};

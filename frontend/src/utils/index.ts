export const getValueFromDocAndMapping = (
  doc: Document,
  mapping: { tag: string; attribute?: string },
) => {
  const element = doc.querySelector(mapping.tag);
  if (mapping.attribute) return element?.getAttribute(mapping.attribute);
  else return element;
};

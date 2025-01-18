export const filterObject = (
  obj: { [prop: string]: any },
  ...keys: string[]
) => {
  const filteredObject = {};
  keys?.forEach((key: string) => {
    if (obj[key]) filteredObject[key] = obj[key];
  });
  return filteredObject;
};

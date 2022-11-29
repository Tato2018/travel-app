export const checkDuplicates = (array: any) => {
  if (array.length !== new Set(array).size) {
    return true;
  }

  return false;
};

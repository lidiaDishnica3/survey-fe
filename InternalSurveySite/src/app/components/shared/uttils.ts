export const isNullOrEmptyWhiteSpace = (str: string) => {
  if (str === null) {
    return true;
  } else if (str.length === 0) {
    return true;
  }
  return false;
}

export const sortQuestionsByOrder = (a, b) => {
  return a.order - b.order;
}

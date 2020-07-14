export function flatten(oldArr) {
  const final = [];
  function inner(param) {
    for (let els of param) {
      if (Array.isArray(els)) inner(els);
      else final.push(els);
    }
  }
  inner(oldArr);
  return final;
}

export function removeSpace(input) {
  return input.split(" ").join("");
}

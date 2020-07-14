export const flatten = oldArr => {
  const final = [];
  function inner(param) {
    for (let els of param) {
      if (Array.isArray(els)) inner(els);
      else final.push(els);
    }
  }
  inner(oldArr);
  return final;
};

export const removeSpace = input => {
  return input.split(" ").join("");
};

export const removeClass = (nodes, classname) => {
  for (let els of nodes) {
    if (els.className.includes(classname)) els.className = "selected";
  }
};

exports.log = function (text) {
  const trace = new Error().stack;
  // filter lines without '(' => no function determined
  const traceLines = trace.split("at").filter((t) => t.split("(").length > 1);
  const traceValues = traceLines.map(
    (t) =>
      "[" +
      t.split("(")[1].split(")")[0].split("\\").slice(-1)[0].split(".")[0].trim() +
      "::" +
      t.split("(")[0].split(".").slice(-1)[0].trim() +
      "]"
  );
  console.log(traceValues[1] + " - " + text);
};

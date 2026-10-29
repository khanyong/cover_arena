// Input is part of the immutable approved plan, never inferred from counts.
// Source indexes are zero-based within this change's verified BEFORE pairs.
export function validateExplicitStructure(structure, before, after) {
  const fail = () => { throw new Error('INVALID_EXPLICIT_STRUCTURE'); };
  if (!structure || !Array.isArray(structure.outputs) || !Array.isArray(structure.deleted)
    || structure.outputs.length !== after.en.length || after.en.length !== after.ko.length) fail();
  const uses = before.map(() => []);
  const outputs = structure.outputs.map((output, index) => {
    const { operation, sources } = output;
    if (!['preserve','replace','merge','split'].includes(operation) || !Array.isArray(sources)
      || !sources.length || new Set(sources).size !== sources.length
      || sources.some(i => !Number.isInteger(i) || i < 0 || i >= before.length)) fail();
    if ((operation === 'merge' && sources.length < 2) || (operation !== 'merge' && sources.length !== 1)) fail();
    const same = sources.length === 1 && ['en','ko'].every(lang => before[sources[0]][lang].body === after[lang][index]);
    if ((operation === 'preserve' && !same) || (operation === 'replace' && same)) fail();
    sources.forEach(i => uses[i].push(operation));
    return { operation, predecessor_indexes: [...sources] };
  });
  const deleted = new Set(structure.deleted);
  if (deleted.size !== structure.deleted.length || [...deleted].some(i => !Number.isInteger(i) || i < 0 || i >= before.length)) fail();
  uses.forEach((operations, i) => {
    if (deleted.has(i)) { if (operations.length) fail(); }
    else if (!operations.length || (operations.includes('split')
      ? operations.length < 2 || operations.some(op => op !== 'split')
      : operations.length !== 1)) fail();
  });
  return { outputs, deleted_predecessor_indexes: [...structure.deleted] };
}

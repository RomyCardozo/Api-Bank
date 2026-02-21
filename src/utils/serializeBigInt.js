function replaceBigInt(value) {
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(replaceBigInt);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = replaceBigInt(v);
    }
    return out;
  }
  return value;
}

module.exports = { replaceBigInt };

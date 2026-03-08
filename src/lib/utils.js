export function ordinalWord(denominator) {
  const words = {
    2: 'half',
    3: 'third',
    4: 'fourth',
    5: 'fifth',
    6: 'sixth',
    7: 'seventh',
    8: 'eighth',
    9: 'ninth',
    10: 'tenth',
    11: 'eleventh',
    12: 'twelfth'
  };
  return words[denominator] || `${denominator}th`;
}

export function ordinalWordPlural(denominator) {
  if (denominator === 2) return 'halves';
  return ordinalWord(denominator) + 's';
}

export function toMixedNumber(numerator, denominator) {
  const whole = Math.floor(numerator / denominator);
  const remainderNumerator = numerator % denominator;
  return { whole, remainderNumerator, denominator };
}

export function slicePath(index, total, cx, cy, r, gap = 1) {
  if (total === 1) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  }

  const sliceAngle = 360 / total;
  const startAngle = index * sliceAngle + gap / 2;
  const endAngle = (index + 1) * sliceAngle - gap / 2;

  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  const largeArc = sliceAngle - gap > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export function ordinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
function pluralize(count, singular, plural) {
  return count === 1 ? `${count} ${singular}` : `${count} ${singular + "s"}`;
}

export { pluralize as p, truncate as t };

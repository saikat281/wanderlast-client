export function formatPrice(price) {
  const value = Number(price);

  if (price === "" || price == null || Number.isNaN(value)) {
    return null;
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDeparture(departureTime) {
  if (!departureTime) {
    return null;
  }

  const date = new Date(departureTime);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

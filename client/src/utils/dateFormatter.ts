const dateFormatter = (date: Date) => {
  const now = new Date().getTime();
  const dateTime = new Date(date).getTime();

  const timeDiffInMillisec = now - dateTime;

  const weekInMillisec = 7 * 24 * 3600 * 1000;
  const dayInMillisec = 24 * 3600 * 1000;
  const hourInMillisec = 3600 * 1000;
  const minuteInMillisec = 60 * 1000;
  const secondInMillisec = 1000;

  if (timeDiffInMillisec > weekInMillisec) {
    // in weeks
    return `${Math.floor(timeDiffInMillisec / weekInMillisec)}w`;
  } else if (timeDiffInMillisec > dayInMillisec) {
    // in days
    return `${Math.floor(timeDiffInMillisec / dayInMillisec)}d`;
  } else if (timeDiffInMillisec > hourInMillisec) {
    // in hours
    return `${Math.floor(timeDiffInMillisec / hourInMillisec)}h`;
  } else if (timeDiffInMillisec > minuteInMillisec) {
    // in minutes
    return `${Math.floor(timeDiffInMillisec / minuteInMillisec)}m`;
  } else {
    // in seconds
    return `${Math.floor(timeDiffInMillisec / secondInMillisec)}s`;
  }
};

export default dateFormatter;

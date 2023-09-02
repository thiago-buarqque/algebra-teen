export const secondsToTime = (secs: number) => {
  secs = Math.round(secs);
  let hours = Math.floor(secs / (60 * 60));

  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  return {
    h: hours,
    m: minutes,
    s: seconds,
  };
}

export const formatTime = (time: { h: number; m: number; s: number }) => {
  let result = "";
  if (time.h > 0) {
    result += time.h + "h ";
  }

  if (time.m > 0) {
    result += time.m + "m ";
  }

  result += time.s + "s";

  return result;
};

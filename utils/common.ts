export const handleNumbers = (number: number) => {
  number = number || 0;
  if (!number) {
    return "";
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(".0", "") + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(".0", "") + "K";
  } else {
    return number.toString();
  }
};

export const formatDate = (d: any, short = false) => {
  const pd = new Date(d);
  const nd = new Date(Date.now());
  let t = Math.floor(Number(nd.getTime() - pd.getTime()) / 60000);
  let dd = nd.getDate() - pd.getDate();
  if (t === 0) {
    return short ? "now" : "Just Now";
  }
  if (t < 60) {
    return short ? t + "m" : t + " min ago";
  }
  if (t >= 60 && t < 1440) {
    return (t / 60).toString().split(".")[0] + `${short ? "h" : " hour ago"}`;
  }
  if (t >= 1440 && t < 39200) {
    return (
      (t / 1440).toString().split(".")[0] + `${short ? "days" : " days ago"}`
    );
  }
  if (t > 39200 && t < 470400) {
    return (
      (t / 39200).toString().split(".")[0] +
      `${short ? "months" : " months ago"}`
    );
  }
  if (t > 470400) {
    return (
      (t / 470400).toString().split(".")[0] + `${short ? "y" : " years ago"}`
    );
  }
  return short ? "long" : "a long ago";
};

export const formatTime = (seconds: number) => {
  seconds = Math.floor(seconds || 0);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  if (minutes < 60) {
    return `${formattedMinutes}:${formattedSeconds}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedRemainingMinutes = String(remainingMinutes).padStart(2, "0");

    return `${formattedHours}:${formattedRemainingMinutes}:${formattedSeconds}`;
  }
};

export const avoidRoute = ["/", "/library", "/social"];
export const autoPlay = true;

export const formatFullDateTime = (timestamp: string) => {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Get last two digits

  const formattedDate = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${amOrPm} - ${day} ${month} ${year}`;

  return formattedDate;
};

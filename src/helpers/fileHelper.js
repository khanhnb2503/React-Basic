import axios from "axios";
import fileDownload from "js-file-download";
import { API_BASE_URL } from "../configs/AppConfig";

export function getFileName(url) {
  let fileName = "";
  if (url) {
    const m = url.substr(url.lastIndexOf("/") + 1);
    if (m) {
      fileName = m;
    }
  }

  return fileName;
}

export async function downloadFileFromUrl(url, fileName, method = "GET") {
  await axios({
    url,
    method,
    responseType: "blob", // Important
  }).then((response) => {
    fileDownload(response.data, getFileName(url));
  });
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function getFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export function isImage(fileName) {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName);
}

export function getFileURL(fileName) {
  if (!fileName) {
    return "";
  }
  if (fileName.startsWith("http")) {
    return fileName;
  }
  return `${API_BASE_URL}/${fileName}`;
}

export const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const VIDEO_MIME = ["video/mp4", "video/quicktime", "video/webm"];
export const FILE_MIME = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "text/plain",
    "text/csv",
    "application/rtf",
    "application/vnd.oasis.opendocument.text",        // .odt
    "application/vnd.oasis.opendocument.spreadsheet", // .ods
    "application/vnd.oasis.opendocument.presentation" // .odp
];

// Optional extension fallbacks for when browsers give unknown/empty MIME
const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"];
const VIDEO_EXT = ["mp4", "mov", "webm", "mkv"];
const FILE_EXT = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf", "odt", "ods", "odp"];

export const DEFAULT_MAX_IMAGE_MB = 2;
export const DEFAULT_MAX_VIDEO_MB = 5;
export const DEFAULT_MAX_DOC_MB = 10; // max size for documents (PDF, DOCX, XLSX, PPTX, TXT, CSV)
export const DEFAULT_MAX_FILES = 5; // number of files allowed combined (image, video, doc)

export const formatAsMB = (bytes, digits = 1) =>
    `${(bytes / (1024 * 1024)).toFixed(digits)} MB`;

const extOf = (name) => {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
};

const getKind = (file, allowedExts) => {
    const mime = file.type || "";
    const ext = extOf(file.name);

    if (IMAGE_MIME.includes(mime) || IMAGE_EXT.includes(ext)) return "image";
    if (VIDEO_MIME.includes(mime) || VIDEO_EXT.includes(ext)) return "video";
    if (FILE_MIME.includes(mime) || FILE_EXT.includes(ext)) return "doc";

    // If the project supplies custom allowedExts, honor them
    if (allowedExts.includes(ext)) return "doc";
    return "unknown";
};

export function describeMediaLimits(limits) {
    const maxImage = limits?.maxImageMB ?? DEFAULT_MAX_IMAGE_MB;
    const maxVideo = limits?.maxVideoMB ?? DEFAULT_MAX_VIDEO_MB;
    const maxDoc = limits?.maxDocMB ?? DEFAULT_MAX_DOC_MB;
    const maxFiles = limits?.maxTotal ?? 5;

    const allow = limits?.allowedMimes ?? [...IMAGE_MIME, ...VIDEO_MIME, ...FILE_MIME];
    const allowImages = allow.some((m) => IMAGE_MIME.includes(m));
    const allowVideos = allow.some((m) => VIDEO_MIME.includes(m));
    const allowDocs = allow.some((m) => FILE_MIME.includes(m));

    const parts = [];
    if (allowImages) parts.push(`Images ≤ ${maxImage}MB`);
    if (allowVideos) parts.push(`Videos ≤ ${maxVideo}MB`);
    if (allowDocs) parts.push(`Documents ≤ ${maxDoc}MB (PDF, DOCX, XLSX, PPTX, TXT, CSV)`);
    return `${parts.join(". ")}. Max ${maxFiles} file${maxFiles > 1 ? "s" : ""}.`;
}

export function validateMediaFiles(
    incoming,
    currentCount,
    limits
){
    const maxTotal = limits?.maxTotal ?? 5;
    const maxImageMB = limits?.maxImageMB ?? DEFAULT_MAX_IMAGE_MB;
    const maxVideoMB = limits?.maxVideoMB ?? DEFAULT_MAX_VIDEO_MB;
    const maxDocMB = limits?.maxDocMB ?? DEFAULT_MAX_DOC_MB;

    const allowedMimes = limits?.allowedMimes ?? [...IMAGE_MIME, ...VIDEO_MIME, ...FILE_MIME];
    const allowedExts = limits?.allowedExts ?? [...IMAGE_EXT, ...VIDEO_EXT, ...FILE_EXT];

    const remaining = Math.max(0, maxTotal - currentCount);
    const trimmed = incoming.slice(0, remaining);

    const accepted = [];
    const rejected = [];

    const dedupeKey = (f) => `${f.name}::${f.size}::${f.lastModified}`;
    const seen = new Set();

    if (incoming.length > trimmed.length) {
        for (const file of incoming.slice(remaining)) {
            rejected.push({
                file, reason: "too_many",
                message: `Too many files. You can only add ${remaining} more.`,
            });
        }
    }

    for (const file of trimmed) {
        const key = dedupeKey(file);
        if (seen.has(key)) {
            rejected.push({ file, reason: "duplicate", message: `Duplicate file: ${file.name}` });
            continue;
        }
        seen.add(key);

        const ext = extOf(file.name);
        const kind = getKind(file, allowedExts);
        const isAllowed =
            allowedMimes.includes(file.type) ||
            allowedExts.includes(ext);

        if (!isAllowed || kind === "unknown") {
            rejected.push({
                file,
                reason: "invalid_type",
                message: `Unsupported type: ${file.name} (${file.type || "unknown"})`,
            });
            continue;
        }

        const maxBytes =
            (kind === "image" ? maxImageMB :
                kind === "video" ? maxVideoMB :
                    maxDocMB) * 1024 * 1024;

        if (file.size > maxBytes) {
            const cap = kind === "image" ? `${maxImageMB}MB` :
                kind === "video" ? `${maxVideoMB}MB` : `${maxDocMB}MB`;
            rejected.push({
                file,
                reason: "too_large",
                message: `${file.name} is too large (${formatAsMB(file.size)}). ` +
                    `${kind === "doc" ? "Documents" : kind === "video" ? "Videos" : "Images"} ≤ ${cap}.`,
            });
            continue;
        }

        accepted.push(file);
    }

    return { accepted, rejected };
}

export function summarizeRejections(items) {
    if (!items.length) return "";
    return items.map((r) => `• ${r.message}`).join("\n");
}

// Turn axios-ish errors into friendly upload messages
export function mapUploadAxiosError(err) {
    const online = typeof navigator !== "undefined" ? navigator.onLine : true;

    // Axios style
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.message || err?.response?.data?.error;

    if (status === 413) return "File is too large for the server (HTTP 413). Please upload a smaller file.";
    if (status === 415) return "Unsupported media type (HTTP 415). Please upload a common image/video format.";
    if (status === 422) return serverMsg || "File validation failed on the server (HTTP 422).";
    if (status && status >= 500) return "Server error while uploading. Please try again shortly.";

    if (err?.code === "ECONNABORTED") return "Upload timed out. Please try again on a stable connection.";
    if (!online) return "You appear to be offline. Please reconnect and retry.";
    if (serverMsg) return serverMsg;

    return err?.message || "Upload failed due to an unknown error.";
}

const fs = require("fs/promises");
const path = require("path");

const contentDir = path.join(process.cwd(), "content");
const publicDir = path.join(process.cwd(), "public");
const videosDir = path.join(publicDir, "videos");
const thumbsDir = path.join(videosDir, "thumbnails");

const ensureDir = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {}
};

const normalizeUrl = (value) => {
  try {
    return encodeURI(decodeURI(value));
  } catch {
    return encodeURI(value);
  }
};

const isUnderVideos = (url) => url.startsWith("/videos/");
const isUnderThumbs = (url) => url.startsWith("/videos/thumbnails/");

const moveIfExists = async (sourcePath, targetPath) => {
  try {
    await fs.access(sourcePath);
  } catch {
    return false;
  }

  await ensureDir(path.dirname(targetPath));

  try {
    await fs.rename(sourcePath, targetPath);
    return true;
  } catch {
    return false;
  }
};

const removeIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch {}
};

const toFileName = (url) => {
  const decoded = decodeURI(url);
  return decoded.replace(/^\/+/, "").split("/").pop() || "";
};

const migrate = async () => {
  const filePath = path.join(contentDir, "videos.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const videos = JSON.parse(raw);

  await ensureDir(videosDir);
  await ensureDir(thumbsDir);

  let changed = false;

  const updated = await Promise.all(
    videos.map(async (video) => {
      const next = { ...video };

      if (typeof next.videoUrl === "string" && next.videoUrl.startsWith("/") && !isUnderVideos(next.videoUrl)) {
        const fileName = toFileName(next.videoUrl);
        const sourcePath = path.join(publicDir, fileName);
        const targetPath = path.join(videosDir, fileName);

        const moved = await moveIfExists(sourcePath, targetPath);
        const targetExists = await fs
          .access(targetPath)
          .then(() => true)
          .catch(() => false);

        if (!moved && targetExists) {
          await removeIfExists(sourcePath);
        }

        if (targetExists || moved) {
          next.videoUrl = normalizeUrl(`/videos/${fileName}`);
          changed = true;
        }
      }

      if (
        typeof next.thumbnail === "string" &&
        next.thumbnail.startsWith("/") &&
        !isUnderThumbs(next.thumbnail)
      ) {
        const fileName = toFileName(next.thumbnail);
        const sourcePath = path.join(publicDir, fileName);
        const targetPath = path.join(thumbsDir, fileName);

        const moved = await moveIfExists(sourcePath, targetPath);
        const targetExists = await fs
          .access(targetPath)
          .then(() => true)
          .catch(() => false);

        if (!moved && targetExists) {
          await removeIfExists(sourcePath);
        }

        if (targetExists || moved) {
          next.thumbnail = normalizeUrl(`/videos/thumbnails/${fileName}`);
          changed = true;
        }
      }

      return next;
    })
  );

  if (changed) {
    await fs.writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, "utf-8");
    console.log("videos.json updated and media moved.");
  } else {
    console.log("No changes needed.");
  }
};

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

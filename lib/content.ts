import { readFile } from "fs/promises";
import { join } from "path";

const contentDir = join(process.cwd(), "content");

export async function getVideos() {
  const filePath = join(contentDir, "videos.json");
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export async function getBrands() {
  const filePath = join(contentDir, "brands.json");
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export async function getServices() {
  const filePath = join(contentDir, "services.json");
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export async function getEquipment() {
  const filePath = join(contentDir, "equipment.json");
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export async function getContact() {
  const filePath = join(contentDir, "contact.json");
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export async function getBackgroundVideos() {
  const filePath = join(contentDir, "backgroundVideos.json");
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}


import { storage } from "@/db/appwrite";
import { ID } from "appwrite";

export const uploadDocument = async (file: File) => {
  const promise = storage.createFile(process.env.APPWRITE_STORAGE_ID || "", ID.unique(), file);

  return promise;
};

export const getDocument = async (fileId: string) => {
  const promise = storage.getFileView(process.env.APPWRITE_STORAGE_ID, fileId);

  return promise;
};

export const updateDocument = async (fileId: string) => {
  const promise = storage.updateFile(process.env.APPWRITE_STORAGE_ID, fileId);

  return promise;
};

export const deleteDocument = async (fileId: string) => {
  const promise = storage.deleteFile(process.env.APPWRITE_STORAGE_ID, fileId);

  return promise;
};

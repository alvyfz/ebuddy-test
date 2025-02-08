import nextConfig from "../../next.config";
const sdk = require("node-appwrite");

export const client = new sdk.Client()
  .setEndpoint(nextConfig?.env?.APPWRITE_API_ENDPOINT || "")
  .setProject(nextConfig?.env?.APPWRITE_PROJECT_ID || "")
  .setKey(nextConfig?.env?.APPWRITE_API_KEY || "");

export const storage = new sdk.Storage(client);

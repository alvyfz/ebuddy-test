"use client";
import { useCookies } from "next-client-cookies";

export default function useHelperApiClient() {
  const { get: getCookies } = useCookies();
  const token = getCookies("Authorization") as string;

  return { token, baseUrl: process.env.BASE_API_URL as string };
}

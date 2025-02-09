import { METHOD } from "@/api/uri";
import Axios from "axios";
import Cookies from "js-cookie";
import nextConfig from "../../next.config";

const request = async (
  method: string,
  url: string,
  request?: { params?: any; headers?: any },
  timeout?: number
) => {
  let headers: any = {
    "Content-Type": "application/json",
  };
  const token = Cookies.get("Authorization");
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  if (request?.headers) {
    headers = {
      ...headers,
      ...request.headers,
    };
  }

  const config = {
    url,
    method,
    data: request?.params ?? undefined,
    timeout: timeout ?? 25000,
    headers,
  };

  console.log(config);

  Axios.defaults.timeout = timeout ?? 25000;

  return Axios(config);
};

export const findJsonInString = (string: any) => {
  let toObj = string.toString().match(/\{(?:[^{}]|(\?R))*\}/g);
  if (toObj === null) return string;
  toObj = JSON.parse(toObj[0]);
  return toObj;
};

const requestResource = async (
  method: "GET" | "POST" | "PUT" | "PATCH",
  path: string,
  data?: { params?: any; headers?: any },
  timeout?: number
) => {
  const url = `${path}${
    method === "GET" && data?.params ? `?${new URLSearchParams(data.params)}` : ""
  }`;
  try {
    const res = await request(method, url, data, timeout);
    if (res.status === 200) {
      return res.data;
    } else {
      return {
        isSuccess: false,
        errCode: res?.status || res?.data?.code || 500,
        errMessage: res?.data?.message || "Unknown error",
      };
    }
  } catch (err: any) {
    console.log(`API ${path} ERROR: `, err);
    // const parseError = findJsonInString(err as any);
    return {
      isSuccess: false,
      errCode: err?.response?.data?.code || err?.status || err?.response?.status || 500,
      errMessage: err?.response?.data?.message || "Unknown error",
    };
  }
};

const post = async (path: string, data?: { params?: any; headers?: any }, timeout?: number) =>
  requestResource(METHOD.POST, nextConfig.env?.BASE_API_URL + path, data, timeout);

const put = async (path: string, data?: { params?: any; headers?: any }, timeout?: number) =>
  requestResource(METHOD.PUT, nextConfig.env?.BASE_API_URL + path, data, timeout);

const get = async (path: string, data?: { params?: any; headers?: any }, timeout?: number) =>
  requestResource(METHOD.GET, nextConfig.env?.BASE_API_URL + path, data, timeout);

export const requestAPI = {
  post,
  put,
  get,
};

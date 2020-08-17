import * as http from "http";
import * as https from "https";
import { Readable } from "stream";

export interface Response<T> {
  body: T;
  headers: http.IncomingHttpHeaders;
  statusCode: number;
  ok: boolean;
}

interface RequestOptions extends https.RequestOptions {
  params?: {};
}

export function get<T>(url: string, options: RequestOptions = {}) {
  return request<T>(url, options);
}

export function post<T>(url: string, body?: any, options: RequestOptions = {}) {
  return request<T>(url, { ...options, method: "POST", body });
}

export function put<T>(url: string, body: any, options: RequestOptions = {}) {
  return request<T>(url, { ...options, method: "PUT", body });
}

export function remove<T>(url: string, options: RequestOptions = {}) {
  return request<T>(url, { ...options, method: "DELETE" });
}

export function request<T = string>(
  url: string,
  { body, params, ...opts }: RequestOptions & { body?: any | FormData } = {}
) {
  return new Promise<Response<T>>((resolve, reject) => {
    opts.headers = opts.headers || {};
    if (body) {
      const json = JSON.stringify(body);
      body = Readable.from(json);
      Object.assign(opts.headers, {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json),
      });
    }
    const query = params && combineParams(params);
    const req = (url.startsWith("https") ? https.request : http.request)(
      query ? `${url}?${query}` : url,
      opts,
      (res) => {
        let bodyText = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (bodyText += chunk));
        res.on("end", () => {
          const response = {
            body: res.headers["content-type"]?.includes("application/json")
              ? JSON.parse(bodyText)
              : bodyText,
            headers: res.headers,
            statusCode: res.statusCode,
          } as Response<T>;
          if (res.statusCode && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(response);
          }
        });
        res.on("error", (error) => reject({ error }));
      }
    );
    req.on("error", (error) => reject({ error }));
    req.on("timeout", () => reject({ error: new Error("Request timed out") }));
    if (body) {
      body.pipe(req);
    } else {
      req.end();
    }
  });
}

const combineParams = (params: {}) =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0) &&
        `${key}=${
          Array.isArray(value)
            ? value.map(encodeURIComponent).join(",")
            : encodeURIComponent(value as any)
        }`
    )
    .filter(Boolean)
    .join("&");

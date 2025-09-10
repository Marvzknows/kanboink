import { toast } from "sonner";

export interface AxiosErrorConfig {
  transitional: {
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
  };
  adapter: string[];
  transformRequest: (null | Function)[];
  transformResponse: (null | Function)[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Record<string, any>;
  headers: Record<string, string>;
  baseURL: string;
  withCredentials: boolean;
  method: string;
  url: string;
  data: string;
  allowAbsoluteUrls: boolean;
}

export type AxiosErrorType = {
  message: string;
  name: "AxiosError";
  stack: string;
  config: AxiosErrorConfig;
  code: string;
  status: number;
  response?: {
    data?: {
      error: string;
      success: boolean;
    };
    status: number;
    statusText: string;
    headers: Record<string, string>;
  };
};

export const handleApiError = (err: AxiosErrorType) => {
  if (!err.response) {
    toast.error("Network error. Please check your connection.");
    return;
  }

  const errorMessage = err.response.data?.error || "Something went wrong";
  toast.error(errorMessage);
};

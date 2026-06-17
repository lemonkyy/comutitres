import { ApiClientError } from "@/lib/api/ApiClientError";

export const handleApiError = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      await readApiErrorMessage(response),
    );
  }

  return response;
};

async function readApiErrorMessage(response: Response) {
  const fallback = response.statusText || "Une erreur est survenue.";
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const serverResponse = await response.json().catch(() => null);

    if (serverResponse && typeof serverResponse === "object") {
      if (
        "message" in serverResponse &&
        typeof serverResponse.message === "string"
      ) {
        return serverResponse.message;
      }

      if (
        "detail" in serverResponse &&
        typeof serverResponse.detail === "string"
      ) {
        return serverResponse.detail;
      }

      if (
        "error" in serverResponse &&
        typeof serverResponse.error === "string"
      ) {
        return serverResponse.error;
      }
    }
  }

  return (await response.text().catch(() => "")) || fallback;
}

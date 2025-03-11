import { INews } from "@/service/news-service";

export const RESPONSE_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};
export function truncateText(text: string, length: number) {
  if (text) {
    return text?.length > length ? text?.slice(0, length) + "..." : text;
  } else return text;
}

export interface HomeResponse {
  categoryName: string;
  news: INews[];
}
export   function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  }
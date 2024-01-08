import { flattenAttributes } from "~/lib/utils";

import qs from "qs";

const query = qs.stringify({
  sort: ['createdAt:desc'],
});

export async function getDescriptions() {
    const baseUrl = process.env.STRAPI_URL || "http://localhost:1337";
    try {
      const response = await fetch(baseUrl + "/api/videos?" + query);
      const data = await response.json();
      const flattenedData = flattenAttributes(data);
      return flattenedData;
    } catch (error) {
      console.log("error", error);
    }
}

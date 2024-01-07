export async function saveDescription(formData: any) {
  const baseUrl = process.env.STRAPI_URL || "http://localhost:1337";

  const dataToSave = {
    data: {
      videoId: formData.videoId,
      description: formData.description,
    },
  };

  try {
    const response = await fetch(baseUrl + "/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...dataToSave }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

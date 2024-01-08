export async function saveNote(formData: any) {
  const baseUrl = process.env.STRAPI_URL || "http://localhost:1337";

  const dataToSave = {
    data: {
      video: formData.videoId,
      title: formData.title,
      content: formData.content,
    },
  };

  try {
    const response = await fetch(baseUrl + "/api/notes", {
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

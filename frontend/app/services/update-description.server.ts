export async function updateDescription(formData: any, id: string) {
  const baseUrl = process.env.STRAPI_URL || "http://localhost:1337";
  
  const dataToSend = { data: { description: formData.description } };

  try {
    const response = await fetch(baseUrl + "/api/videos/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...dataToSend }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

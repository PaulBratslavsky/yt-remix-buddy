import { useEffect } from "react";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { DescriptionList } from "~/components/custom/DescriptionList";
import { getDescriptions } from "~/services/get-descriptions.server";
import { updateDescription } from "~/services/update-description.server";
import { deleteDescription } from "~/services/delete-description.server";

export async function loader() {
  const data = await getDescriptions();
  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);

  let data: any = null;

  switch (formItems._action) {
    case "update":
      data = await updateDescription(formItems, formItems.videoId as string);
      return json({ data: data, message: "Updated!" });
    case "delete":
      data = await deleteDescription(formItems.videoId as string);
      return json({ data: { description: data, videoId: formItems.videoId } });

    default:
      return json({ data: null, message: "No action found!" });
  }
}

export function DescriptionListLoader() {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle") {
      fetcher.load("/resources/videos");
    }
  }, []);

  const data = fetcher.data;
  if (fetcher.state === "loading" || !data) return <p>Loading...</p>;
  return <DescriptionList data={data} />;
}

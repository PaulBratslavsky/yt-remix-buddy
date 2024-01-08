import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";

import { generateDescription } from "~/services/generate-description.server";
import { saveDescription } from "~/services/save-description.server";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  isRouteErrorResponse,
  useRouteError,
  Outlet,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DescriptionListLoader } from "./resources.videos";
import { extractYouTubeID, renderMessage } from "~/lib/utils";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);

  const videoId = extractYouTubeID(formItems.videoId as string);
  if (!videoId)
    return json({ data: null, error: true, message: "Invalid video ID" });
  formItems.videoId = videoId;

  let data: any = null;

  switch (formItems._action) {
    case "generate":
      data = await generateDescription(videoId);
      return json({
        data: { description: data, videoId: formItems.videoId },
        message: "Generated!",
        error: false,
      });
    case "save":
      await saveDescription(formItems);
      return json({ data: null, message: "Saved!", error: false });
    default:
      return json({ data: null, message: "No action found!", error: true });
  }
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default function Index() {
  const formActionData = useActionData<typeof action>();

  useEffect(() => {
    if (formActionData?.error) {
      renderMessage(formActionData?.message, "error");
    }

    if (formActionData?.error === false) {
      renderMessage(formActionData?.message, "success");
    }
  }, [formActionData]);

  const onUpdate = formActionData?.data?.videoId as string;
  return (
    <div>
      <h1>Generate Video Description</h1>
      <div key={onUpdate}>
        <GenerateDescriptionForm />
        <SaveDescriptionForm data={formActionData} />
      </div>
      <DescriptionListLoader />
      <Outlet />
    </div>
  );
}

function GenerateDescriptionForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("_action") === "generate";

  return (
    <Form method="POST">
      <fieldset
        disabled={isSubmitting}
        className="flex gap-2 items-center justify-center my-4"
      >
        <Input
          name="videoId"
          placeholder="Youtube Video ID or URL"
          className="w-full"
          required
        />
        <Button name="_action" value="generate" type="submit">
          {isSubmitting ? "Generating..." : "Generate Description"}
        </Button>
      </fieldset>
    </Form>
  );
}

function SaveDescriptionForm({ data }: { readonly data: any }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("_action") === "save";

  if (!data?.data) return null;
  return (
    <Form method="POST" className="w-full">
      <fieldset disabled={isSubmitting}>
        <Textarea
          name="description"
          className="w-full h-[400px]"
          defaultValue={data?.data.description}
        />
        <input type="hidden" name="videoId" defaultValue={data?.data.videoId} />
        <Button
          name="_action"
          value="save"
          className="float-right my-2"
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save Description"}
        </Button>
      </fieldset>
    </Form>
  );
}

import { Modal } from "~/components/custom/Modal";
import { useFetcher } from "@remix-run/react";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { chat } from "~/services/chat";
import { useEffect, useState } from "react";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);
  const videoId = params.videoId;

  switch (formItems._action) {
    case "chat":
      const response = await chat(videoId as string, formItems.query as string);
      return json({ data: response?.text, message: "Updated!" });
    default:
      return json({ data: null, message: "No action found!" });
  }
}

export default function ChatRoute() {
  const [text, setText] = useState("");
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.formData?.get("_action") === "chat";
  const data = fetcher.data;

  useEffect(() => {
    setText(data?.data);
  }, [data]);

  return (
    <div>
      <Modal>
        {data?.data && (
          <Textarea
            name="description"
            className="w-full h-[400px]"
            defaultValue={text}
            disabled
          />
        )}
        <fetcher.Form key={data?.data} method="POST" className="w-full">
          <fieldset
            disabled={isSubmitting}
            className="flex gap-2 items-center justify-center my-4"
          >
            <Input
              name="query"
              placeholder="Ask your question"
              className="w-full"
              required
            />
            <Button name="_action" value="chat" type="submit">
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </fieldset>
        </fetcher.Form>
      </Modal>
    </div>
  );
}

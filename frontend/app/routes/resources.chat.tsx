import { useEffect } from "react";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Modal } from "~/components/custom/Modal";
import { useFetcher, useNavigation } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export async function loader() {
  return json({ data: null, message: "No action found!" });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);

  return json({ data: formItems, message: "No action found!" });
}

export function ChatLoader({ videoId }: { readonly videoId: string }) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle") {
      fetcher.load("/resources/chat");
    }

    console.log(fetcher.data, "fetcher.data")
  }, []);

  return (
    <Modal>
      <ChatForm videoId={videoId} />
    </Modal>
  );
}

function ChatForm({ videoId }: { readonly videoId: string }) {
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const isSubmitting = navigation.formData?.get("_action") === "chat";


  return (
    <fetcher.Form method="POST" action="/resources/chat" className="w-full">
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
        <input type="hidden" name="videoId" defaultValue={videoId} />
        <Button type="submit">{isSubmitting ? "Sending..." : "Send"}</Button>
      </fieldset>
    </fetcher.Form>
  );
}

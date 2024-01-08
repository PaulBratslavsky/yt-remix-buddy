import { Modal } from "~/components/custom/Modal";
import { useFetcher } from "@remix-run/react";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { chat } from "~/services/chat";
import { useEffect, useState } from "react";
import { PencilIcon } from "~/components/icons/PencilIcon";
import { CancelIcon } from "~/components/icons/CancelIcon";
import { BookMarkIcon } from "~/components/icons/BookMarkIcon";
import { saveNote } from "~/services/save-note.server";
import { Spinner } from "~/components/custom/Spinner";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);
  const videoId = params.videoId;

  let response: any = null;

  switch (formItems._action) {
    case "chat":
      response = await chat(videoId as string, formItems.query as string);
      return json({ data: response?.text, message: "Updated!" });
    case "bookmark":
      await saveNote(formItems);
      return json({ data: null, message: "Bookmarked!" });
    default:
      return json({ data: null, message: "No action found!" });
  }
}

export default function ChatRoute() {
  const [text, setText] = useState("");
  const [edit, setEdit] = useState(false);
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.formData?.get("_action") === "chat";
  const isSaving = fetcher.formData?.get("_action") === "bookmark";

  const data = fetcher.data;

  useEffect(() => {
    setText(data?.data);
  }, [data]);

  return (
    <div>
      <Modal>
        {text && (
          <fetcher.Form method="POST" className="w-full">
            <fieldset
              disabled={isSubmitting || isSaving}
              className="flex-row gap-2 items-center justify-center my-4 relative"
            >
              {edit && (
                <div className="flex gap-2">
                  <Input
                    name="title"
                    placeholder="Add a title"
                    className="w-full"
                    required
                  />
                  {edit && (
                    <span>
                      <Button
                        type="submit"
                        className="bg-violet-600 hover:bg-violet-500"
                        name="_action"
                        value="bookmark"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Spinner />
                        ) : (
                          <BookMarkIcon className="w-4 h-4" />
                        )}
                      </Button>
                    </span>
                  )}
                </div>
              )}

              <Textarea
                name="content"
                className="w-full h-[400px] mt-4"
                defaultValue={text}
                disabled={!edit}
              />
            </fieldset>
          </fetcher.Form>
        )}
        <fetcher.Form key={data?.data} method="POST" className="w-full">
          <fieldset
            disabled={isSubmitting || isSaving}
            className="flex gap-2 items-center justify-center my-4"
          >
            <Input
              name="query"
              placeholder="Ask your question"
              className="w-full"
              required
            />
            <Button name="_action" value="chat" type="submit" >
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
            {text && (
              <span>
                <Button
                  className={edit ? "" : "bg-violet-600 hover:bg-violet-500"}
                  onClick={() => setEdit(!edit)}
                >
                  {edit ? (
                    <CancelIcon className="w-4 h-4" />
                  ) : (
                    <PencilIcon className="w-4 h-4" />
                  )}
                </Button>
              </span>
            )}
          </fieldset>
        </fetcher.Form>
      </Modal>
    </div>
  );
}

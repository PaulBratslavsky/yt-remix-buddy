import { useFetcher, useNavigation, Link } from "@remix-run/react";
import { TextareaCustom } from "~/components/custom/TextareaCustom";
import { Spinner } from "~/components/custom/Spinner";
import { TrashIcon } from "~/components/icons/TrashIcon";
import { ChatIcon } from "~/components/icons/ChatIcon";
import YouTubePlayer from "~/components/custom/YouTubePlayer";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "../ui/button";

export function DescriptionList({ data }: { readonly data: any }) {
  return (
    <div className="my-4">
      {data.data.map((item: any) => (
        <DescriptionCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function DescriptionCard({ item }: { readonly item: any }) {
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isUpdating = fetcher.formData?.get("_action") === "update";
  const isDeleting = fetcher.formData?.get("_action") === "delete";

  return (
    <Card className="mb-8 relative">
      <CardHeader>
        <CardTitle>Video Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <YouTubePlayer key={item.id} playerKey={item.id} id={item.videoId} />
        </div>

        <div>
          <fetcher.Form method="POST" action="/resources/videos">
            <fieldset disabled={isUpdating}>
              <TextareaCustom
                name="description"
                className="w-full mb-5"
                defaultValue={item.description}
              />
              <input type="hidden" name="videoId" value={item.id} />
              <Button
                name="_action"
                value="update"
                className="absolute right-4 bottom-4"
                type="submit"
              >
                {isUpdating ? <Spinner /> : "Update"}
              </Button>
            </fieldset>
          </fetcher.Form>
          <fetcher.Form method="POST" action="/resources/videos">
            <fieldset disabled={isDeleting}>
              <Button
                name="_action"
                value="delete"
                className="absolute right-4 top-4 bg-red-700 hover:bg-red-600"
                type="submit"
              >
                {isDeleting ? <Spinner /> : <TrashIcon className="w-4 h-4" />}
              </Button>
              <input type="hidden" name="videoId" value={item.id} />
            </fieldset>
          </fetcher.Form>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/dashboard/chat/${item.videoId}`}>
          <Button className="absolute right-20 top-4 bg-violet-600 hover:bg-violet-500">
            <ChatIcon className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

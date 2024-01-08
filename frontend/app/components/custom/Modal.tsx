import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";


export function Modal({ children }: { readonly children: React.ReactNode }) {
  return (
    <Dialog open>
      <DialogContent className="max-w-[980px]">
        <DialogHeader>
          <DialogTitle>Chat Bot</DialogTitle>
          <DialogDescription>
            Have a conversation about your video.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        {children}
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


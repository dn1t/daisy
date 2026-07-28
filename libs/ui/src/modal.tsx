import { useCallback, useState, type ComponentProps, type Dispatch, type SetStateAction } from "react";
import { cn } from "tailwind-variants";

function _Modal({
  open,
  setOpen,
  ...props
}: ComponentProps<"div"> & { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {
  const [_open, _setOpen] = useState(false);

  const ref = useCallback(
    (node: HTMLDialogElement | null) => {
      if (!node) return;
      if (open && !node.open) {
        node.showModal();
        _setOpen(true);
      } else if (!open && node.open) {
        setTimeout(() => {
          node.close();
        }, 200);
        _setOpen(false);
      }
    },
    [open],
  );

  return (
    <dialog
      ref={ref}
      className="group h-full max-h-none w-full max-w-none items-center justify-center bg-transparent backdrop:bg-transparent open:flex"
      onCancel={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
      data-open={_open}
    >
      <div
        className="fixed inset-0 z-99 bg-zinc-500/25 backdrop-blur-xs transition-opacity group-data-[open=false]:opacity-0 group-data-[open=false]:duration-200 group-data-[open=true]:duration-300 group-data-[open=false]:ease-in group-data-[open=true]:ease-out"
        onClick={() => setOpen(false)}
      />
      <div
        {...props}
        className={cn(
          "corner-squircle z-100 rounded-2xl bg-white transition-all group-data-[open=false]:translate-y-0 group-data-[open=false]:scale-95 group-data-[open=false]:opacity-0 group-data-[open=false]:duration-200 group-data-[open=true]:duration-300 group-data-[open=false]:ease-in group-data-[open=true]:ease-out supports-corner-shape:rounded-4xl dark:bg-black",
          props.className,
        )}
      >
        {props.children}
      </div>
    </dialog>
  );
}

export function createModal() {
  const [open, setOpen] = useState(false);

  function Modal(props: ComponentProps<"div">) {
    return <_Modal {...props} open={open} setOpen={setOpen} />;
  }

  return { open, setOpen, Modal };
}

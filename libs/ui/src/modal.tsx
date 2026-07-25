import { type ComponentProps, createEffect, createSignal, type Signal } from "solid-js";
import { cn } from "tailwind-variants";

function _Modal(props: ComponentProps<"div"> & { signal: Signal<boolean> }) {
  let ref!: HTMLDialogElement;
  const [open, setOpen] = props.signal;
  const [_open, _setOpen] = createSignal(false);

  createEffect(() => {
    if (open() && !ref.open) {
      ref.showModal();
      _setOpen(true);
    } else if (!open() && ref.open) {
      setTimeout(() => {
        ref.close();
      }, 200);
      _setOpen(false);
    }
  });

  return (
    <dialog
      ref={ref}
      class="group h-full max-h-none w-full max-w-none items-center justify-center bg-transparent backdrop:bg-transparent open:flex"
      onCancel={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
      data-open={_open()}
    >
      <div
        class="fixed inset-0 z-99 bg-zinc-500/25 backdrop-blur-xs transition-opacity group-data-[open=false]:opacity-0 group-data-[open=false]:duration-200 group-data-[open=true]:duration-300 group-data-[open=false]:ease-in group-data-[open=true]:ease-out"
        onClick={() => setOpen(false)}
      />
      <div
        {...props}
        class={cn(
          "corner-squircle z-100 rounded-2xl bg-white transition-all group-data-[open=false]:translate-y-0 group-data-[open=false]:scale-95 group-data-[open=false]:opacity-0 group-data-[open=false]:duration-200 group-data-[open=true]:duration-300 group-data-[open=false]:ease-in group-data-[open=true]:ease-out supports-corner-shape:rounded-4xl dark:bg-black",
          props.class,
        )}
      >
        {props.children}
      </div>
    </dialog>
  );
}

export function createModal() {
  const [open, setOpen] = createSignal(false);

  function Modal(props: ComponentProps<"div">) {
    return <_Modal {...props} signal={[open, setOpen]} />;
  }

  return { open, setOpen, Modal };
}

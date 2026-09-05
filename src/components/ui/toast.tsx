"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared global manager — any client component can call
// `toastManager.add(...)` directly, without needing to be a descendant
// of <Toaster />'s own provider tree.
export const toastManager = ToastPrimitive.createToastManager();

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toast) => (
    <ToastPrimitive.Root
      key={toast.id}
      toast={toast}
      className={cn(
        "absolute right-0 bottom-0 left-0 z-[calc(1000-var(--toast-index))] mx-auto w-full origin-bottom rounded-xl border border-border bg-card text-card-foreground shadow-lg select-none",
        "[transform:translateY(calc(var(--toast-offset-y)*-1-(var(--toast-index)*0.75rem)))_scale(calc(max(0,1-(var(--toast-index)*0.05))))]",
        "transition-[transform,opacity] duration-300 data-ending-style:opacity-0 data-starting-style:translate-y-full data-starting-style:opacity-0"
      )}
    >
      <ToastPrimitive.Content className="flex items-start gap-3 p-4">
        <div className="flex-1">
          <ToastPrimitive.Title className="text-sm font-semibold" />
          <ToastPrimitive.Description className="mt-0.5 text-sm text-muted-foreground" />
        </div>
        <ToastPrimitive.Close
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <XIcon className="size-4" aria-hidden="true" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  ));
}

export function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-50 mx-auto w-[calc(100vw-2rem)] sm:w-96">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

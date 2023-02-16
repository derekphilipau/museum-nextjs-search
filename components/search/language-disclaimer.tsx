import * as React from "react"
import { Icons } from "../icons";
import ObjectContactForm from "@/components/forms/object-contact-form";
import { Button } from "@/components/ui/button";

export function LanguageDisclaimer({ item }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div
      className="mt-6 rounded-md bg-neutral-50 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
    >
      <div className="p-4">
        <div className="flex items-center">
          <div className="shrink-0">
            <Icons.info className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1 sm:flex sm:items-center sm:justify-between">
            <p className="text-sm">
              Have a concern, a correction, or something to add?
            </p>
            {
              !isOpen && (
                <Button
                  onClick={() => setIsOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="px-0 sm:p-3"
                >
                  Contact us
                  <span className="sr-only">Contact Form Toggle</span>
                </Button>
              )
            }
          </div>
        </div>
      </div>
      {
        isOpen && (
          <div className="p-4">
            <ObjectContactForm item={item} />
          </div>
        )
      }
    </div>
  )
}
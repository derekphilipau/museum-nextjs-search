import * as React from "react"
import { Icons } from "../icons";

export function LanguageDisclaimer() {
  return (
    <div className="mt-6 rounded-md bg-neutral-50 p-4 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
      <div className="flex">
        <div className="shrink-0">
          <Icons.info className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm">
          Have a concern, a correction, or something to add? 
          </p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <a href="mailto:information@brooklynmuseum.org" className="whitespace-nowrap font-medium">
              Contact us
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
import * as React from "react"
import Link from "next/link"

import { Input } from "../ui/input"
import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <div className="container p-6">
      <nav className="my-10 md:flex md:items-center md:justify-between md:space-x-6">
        <div>
          <Link href="/" className="mb-4 flex items-center space-x-2">
            <Icons.logo className="w-52 fill-current" />
            <span className="hidden font-bold">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mb-2 text-xs">
            200 Eastern Parkway
            <br />
            Brooklyn, New York 11238-6052
          </p>
          <p className="text-xs">
            The Brooklyn Museum stands on land that is part of the unceded, ancestral homeland of the Lenape (Delaware) people.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <h5 className="mb-2 text-lg">
            Let&apos;s Stay Connected
          </h5>
          <Input name="marketing" placeholder="Sign Up" />
        </div>
      </nav>

    </div>
  )
}

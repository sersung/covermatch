"use client"

import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Bookmark, Loader2 } from "lucide-react"
import Link from "next/link"

type Props = {
  onSave: () => Promise<void>
  saving: boolean
}

export default function SaveButton({ onSave, saving }: Props) {
  const { data: session } = useSession()

  if (session) {
    return (
      <Button onClick={onSave} disabled={saving} className="shrink-0">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bookmark className="w-4 h-4 mr-2" />}
        {saving ? "Saving…" : "Save Estimate"}
      </Button>
    )
  }

  return (
    <Link href="/sign-in">
      <Button className="shrink-0">
        <Bookmark className="w-4 h-4 mr-2" /> Sign In to Save
      </Button>
    </Link>
  )
}

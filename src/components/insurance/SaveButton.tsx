"use client"

import { useAuth, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Bookmark, Loader2 } from "lucide-react"

type Props = {
  onSave: () => Promise<void>
  saving: boolean
}

export default function SaveButton({ onSave, saving }: Props) {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <Button onClick={onSave} disabled={saving} className="shrink-0">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bookmark className="w-4 h-4 mr-2" />}
        {saving ? "Saving…" : "Save Estimate"}
      </Button>
    )
  }

  return (
    <SignInButton mode="modal">
      <Button className="shrink-0">
        <Bookmark className="w-4 h-4 mr-2" /> Sign In to Save
      </Button>
    </SignInButton>
  )
}

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bookmark, Loader2 } from "lucide-react"

type Props = {
  onSave: () => Promise<void>
  saving: boolean
}

export default function SaveButton({ onSave, saving }: Props) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <Button disabled className="shrink-0">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
      </Button>
    )
  }

  if (session?.user) {
    return (
      <Button onClick={onSave} disabled={saving} className="shrink-0">
        {saving
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
          : <><Bookmark className="w-4 h-4 mr-2" /> Save Estimate</>}
      </Button>
    )
  }

  return (
    <Button className="shrink-0" onClick={() => router.push("/sign-in")}>
      <Bookmark className="w-4 h-4 mr-2" /> Sign In to Save
    </Button>
  )
}

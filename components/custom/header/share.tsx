"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Copy } from "lucide-react"
import { Share } from "lucide-react"
import { usePathname } from "next/navigation"

export function ShareDialog() {
    const [isCopied, setIsCopied] = useState(false)
    const shareUrl = `${window.location.origin}${usePathname()}`

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">
                    <Share className="mr-2 h-4 w-4" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Share</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="share-url">Share URL</Label>
                        <div className="flex items-center">
                            <Input
                                id="share-url"
                                value={shareUrl}
                                readOnly
                                className="pr-10 h-12"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="ml-[-40px]"
                                onClick={handleCopy}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {isCopied && (
                        <p className="text-sm text-green-600">Copied to clipboard!</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

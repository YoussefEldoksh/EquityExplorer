import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "./ui/tooltip";
import { Info } from 'lucide-react';

interface Props {
    explain: string
}

function ToolTip({ explain }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <TooltipProvider>
            <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                    <Button
                        className="bg-transparent text-zinc-500"
                        onClick={() => setOpen(v => !v)}
                    >
                        <Info />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-md">
                    <p>{explain}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ToolTip
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from 'lucide-react';
import { TooltipProvider } from "./ui/tooltip";

interface Props {
    explain: string
}

function ToolTip({ explain }: Props) {
    return (
<TooltipProvider>

        <Tooltip >
            <TooltipTrigger asChild >
                <Button className="bg-transparent text-zinc-500"><Info /></Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-md ">
                <p className="" >{explain}</p>
            </TooltipContent>
        </Tooltip>
            </TooltipProvider>

    )
}

export default ToolTip
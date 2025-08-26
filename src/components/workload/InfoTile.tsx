import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface InfoTileProps {
    title: string; // Total units
    value: number; // 12
    color: string; // green-500
}

export default function InfoTile({ title, value, color }: InfoTileProps) {
    const renderTooltipContent = (title: string) => {
        switch (title) {
            case "Total units":
                return (<>
                        <p>Green: Light workload (≤12 units)</p>
                        <p>Yellow: Moderate workload (13-16 units)</p>
                        <p>Red: Heavy workload (≥17 units)</p>
                    </>);
            case "Avg rating":
                return (<>
                        <p>Green: Excellent rating (≥4.0)</p>
                        <p>Yellow: Good rating (3.0-3.9)</p>
                        <p>Red: Poor rating (≤2.9)</p>
                    </>);
            case "Workload score":
                return (<>
                        <p>Green: Easy workload (0-40)</p>
                        <p>Yellow: Moderate workload (41-70)</p>
                        <p>Red: Challenging workload (71-100)</p>
                    </>);
        }
    }
    return (
        <div className="text-center">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="text-muted-foreground underline decoration-dashed decoration-muted-foreground underline-offset-2 cursor-help">{title}</div>
                </TooltipTrigger>
                <TooltipContent>
                    {renderTooltipContent(title)}
                </TooltipContent>
            </Tooltip>
            <div className={`font-medium text-white ${color} px-2 py-1 rounded w-12 mx-auto mt-1`}>{value}</div>
        </div>
    );
}
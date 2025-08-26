import { Course } from "@/popup/App";
import InfoTile from "./InfoTile";

interface WorkloadOverviewProps {
    courses: Course[];
}

export default function WorkloadOverview({ courses }: WorkloadOverviewProps) {
    const totalUnits = courses.reduce((acc, course) => acc + parseFloat(course.units), 0);
    return (
        <div className="mt-4 p-3 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 text-sm">Workload Overview</h3>
            <div className="flex items-center justify-between text-sm">
                <InfoTile title="Total units" value={totalUnits} color="bg-green-500" />
                <InfoTile title="Avg rating" value={3.9} color="bg-yellow-500" />
                <InfoTile title="Workload score" value={21} color="bg-red-500" />
            </div>
        </div>
    );
}
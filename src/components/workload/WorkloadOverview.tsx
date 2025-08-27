import { Course } from "@/popup/App";
import InfoTile from "./InfoTile";
import { getInstructorRating } from "@/lib/courseUtils";

interface WorkloadOverviewProps {
    courses: Course[];
}

export default function WorkloadOverview({ courses }: WorkloadOverviewProps) {
    const totalUnits = courses.reduce((acc, course) => acc + parseFloat(course.units), 0);

    const instructorRatings = courses.map(course => getInstructorRating(course)).filter(rating => rating !== null);
    const avgRating = instructorRatings.reduce((acc, rating) => acc + rating, 0) / instructorRatings.length;
    const avgRatingRounded = Math.round(avgRating * 10) / 10;

    return (
        <div className="mt-4 p-3 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 text-sm">Workload Overview</h3>
            <div className="flex items-center justify-between text-sm">
                <InfoTile title="Total units" value={totalUnits} color={totalUnits <= 16 ? "bg-green-500" : totalUnits <= 20 ? "bg-yellow-500" : "bg-red-500"} />
                <InfoTile title="Avg rating" value={avgRatingRounded} color={avgRatingRounded >= 4 ? "bg-green-500" : avgRatingRounded >= 3 ? "bg-yellow-500" : "bg-red-500"} />
                <InfoTile title="Weekly workload" value="21 hrs" color="bg-red-500" />
            </div>
        </div>
    );
}
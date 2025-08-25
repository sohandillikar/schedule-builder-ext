import Header from "@/components/header/Header";
import Courses from "@/components/courses/Courses";
import WorkloadOverview from "@/components/workload/WorkloadOverview";
import ExportButton from "@/components/ExportButton";

// Sample course data for UC Davis students
const sampleCourses = [
  {
    shortTitle: "ECS 120 - A02",
    fullTitle: "Theory of Computation",
    crn: "29024",
    units: 4,
    instructor: "C. Aram",
    rating: 3.8
  },
  {
    shortTitle: "ECS 154A - A01",
    fullTitle: "Computer Architecture",
    crn: "28756",
    units: 4,
    instructor: "J. Owens",
    rating: 4.2
  },
  {
    shortTitle: "ECS 171 - A01",
    fullTitle: "Machine Learning",
    crn: "30145",
    units: 4,
    instructor: "S. Chen",
    rating: 4.5
  },
  {
    shortTitle: "MAT 108 - A02",
    fullTitle: "Introduction to Abstract Mathematics",
    crn: "25892",
    units: 3,
    instructor: "R. Smith",
    rating: 3.2
  }
];

const Index = () => {
    return (
        <div className="extension-container bg-background font-figtree">
            <Header />
            <div className="flex-1 overflow-y-auto p-4">
                <Courses courses={sampleCourses} />
                <WorkloadOverview />
                <ExportButton />
            </div>
        </div>
    );
};

export default Index;
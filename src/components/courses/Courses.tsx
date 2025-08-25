import CourseCard from "./CourseCard";
import CourseFilter from "./CourseFilter";

export interface Course {
    shortTitle: string; // ECS 120 - A02
    fullTitle: string;  // Theory of Computation
    crn: string;        // 29024
    units: number;      // 4
    instructor: string; // C. Aramian
    rating: number;     // 4.5
}

interface CoursesProps {
    courses: Course[];
}

export default function Courses({ courses }: CoursesProps) {
    return (
      <div>
        <CourseFilter />
        <div className="grid grid-cols-2 gap-3">
            {courses.map((course, i) => <CourseCard key={i} course={course} />)}
        </div>
      </div>  
    );
}
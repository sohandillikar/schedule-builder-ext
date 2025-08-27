import { Course } from "@/popup/App";
import allCattlelogCourses from "@/all_cattlelog_courses.json";

function fetchAllCourses(): any {
    // TODO: Talk to Jake to get this API to work for origin chrome-extension://
    // const url = "https://api.daviscattlelog.com/courses/all";
    return allCattlelogCourses;
}

export function getInstructorRating(course: Course): number | null {
    let [dept, classCode, secCode] = course.shortTitle.split(" ");
    if (classCode[0] === "0")
        classCode = classCode.slice(1);

    const courseId = `${dept}${classCode}`;
    const [instructorFirstInitial, instructorLastName] = course.instructor.split(". ");

    const allCourses = fetchAllCourses();
    const courseData = allCourses.find((c: any) => c.course_id === courseId);

    if (!courseData) return null;

    const professor = courseData.professors.find((p: any) => {
        const professorNames = p.professor_name.split(" ");
        const professorFirstInitial = professorNames[0][0].toLowerCase();
        const professorLastName = professorNames[professorNames.length - 1].toLowerCase();

        return professorFirstInitial === instructorFirstInitial.toLowerCase() && professorLastName === instructorLastName.toLowerCase();
    });

    if (!professor) return null;

    return professor.overall_rating;
}

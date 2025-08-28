import { Course } from "@/popup/App";
import allCattlelogCourses from "@/all_cattlelog_courses.json";
import { QUARTER_DATES } from "./constants";

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

export function calculateWeeklyHours(course: Course, academicTerm: string | null): number {
    const courseUnits = parseInt(course.units);

    const hoursPerUnit = 3;
    const termLength = getTermLength(course, academicTerm);
    const hoursPerUnitPerTerm = hoursPerUnit * termLength;

    const courseLevel = getCourseLevel(course);
    const profFactor = calculateProfessorFactor(course);

    const weeklyHours = ((courseUnits * hoursPerUnitPerTerm) / termLength) * courseLevel * profFactor;

    return weeklyHours;
}

function getTermLength(course: Course, academicTerm: string | null): number {
    // Get number of weeks in term
    let termStartDate: Date;
    let termEndDate: Date;
    if (academicTerm && academicTerm in QUARTER_DATES) {
        termStartDate = new Date(QUARTER_DATES[academicTerm as keyof typeof QUARTER_DATES].start + "T00:00:00");
        termEndDate = new Date(QUARTER_DATES[academicTerm as keyof typeof QUARTER_DATES].end + "T00:00:00");
    } else {
        termStartDate = new Date();
        termEndDate = new Date(course.finalExamDate);
    }

    return (termEndDate.getTime() - termStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
}

function getCourseLevel(course: Course): number {
    let [dept, classCode, secCode] = course.shortTitle.split(" ");
    const classCodeNum = parseInt(classCode);

    if (classCodeNum < 100) return 1;
    if (classCodeNum < 200) return 1.1;
    return 1.3;
}

function calculateProfessorFactor(course: Course): number {
    const low = 0.85;
    const high = 1.25;
    const rating = getInstructorRating(course);

    if (!rating) return (low + high) / 2;
    return clamp(1 + 0.08 * (3.5 - rating), low, high);
}

function clamp(x: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, x));
}
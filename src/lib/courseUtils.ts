import { Course } from "@/popup/App";
import allCattlelogCourses from "@/all_cattlelog_courses.json";
import { QUARTER_DATES } from "./constants";

interface CompressedCourse {
    shortTitle: string;
    instructor: string;
}

interface InstructorRatingResult {
    rating: number | null;
    courseUrl: string | null;
    instructorUrl: string | null;
}

function fetchAllCourses(): any {
    // TODO: Talk to Jake to get this API to work for origin chrome-extension://
    // const url = "https://api.daviscattlelog.com/courses/all";
    return allCattlelogCourses;
}

function fetchAllProfessors() {
    const allCourses = fetchAllCourses();
    const allProfessors = new Set(allCourses.flatMap((c: any) => c.professors));
    return Array.from(allProfessors);
}

function getProfessor(name: string) {
    // Example name: "S. Saltzen"
    if (!name.includes(". ")) return null;

    let [firstInitial, lastName] = name.split(". ");
    if (lastName.includes(" ")) {
        const lastNameParts = lastName.split(" ");
        lastName = lastNameParts[lastNameParts.length - 1];
    }
    firstInitial = firstInitial.toLowerCase();
    lastName = lastName.toLowerCase();

    const allProfessors = fetchAllProfessors();

    const professor = allProfessors.find((p: any) => {
        const pNames = p.professor_name.split(" ");
        const pFirstInitial = pNames[0][0].toLowerCase();
        const pLastName = pNames[pNames.length - 1].toLowerCase();
        return pFirstInitial === firstInitial && pLastName === lastName;
    });

    return professor;
}

export function getInstructorRating(course: Course | CompressedCourse): InstructorRatingResult {
    let [dept, classCode, secCode] = course.shortTitle.split(" ");
    if (classCode[0] === "0")
        classCode = classCode.slice(1);

    const courseId = `${dept}${classCode}`;
    const courseUrl = `https://daviscattlelog.com/course/${courseId}`;

    const professor: any = getProfessor(course.instructor);

    return {
        rating: professor ? professor.overall_rating : null,
        courseUrl: courseUrl,
        instructorUrl: professor ? `https://daviscattlelog.com/professor/${professor.slug}` : null
    };
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
    const rating = getInstructorRating(course).rating;

    if (!rating) return (low + high) / 2;
    return clamp(1 + 0.08 * (3.5 - rating), low, high);
}

function clamp(x: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, x));
}
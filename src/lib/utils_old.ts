import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Course } from "@/popup/App";
import { ORGANIZATION, PRODUCT_NAME, QUARTER_DATES } from "./constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function downloadICS(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function generateICS(courses: Course[], academicTerm: string | null): string {
    let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//${ORGANIZATION}//${PRODUCT_NAME}//EN\n`;
    
    for (const course of courses) {
        for (const meeting of course.meetings)
            ics += generateMeetingEvent(course, meeting, academicTerm);
        ics += generateFinalExam(course);
    }
    
	ics += "END:VCALENDAR";
    return ics;
}

function generateMeetingEvent(course: Course, meeting: any, academicTerm: string | null): string {
    const weekdays: Record<string, number> = {"M": 1, "T": 2, "W": 3, "R": 4, "F": 5};
    const icsWeekdays: Record<string, string> = {"M": "MO", "T": "TU", "W": "WE", "R": "TH", "F": "FR"};
    
    // Parse meeting time
    const [startTime, endTime] = meeting.time.split(" - ");
    const [startHour, startMin] = parseTime(startTime);
    const [endHour, endMin] = parseTime(endTime);
    
    // Get quarter instruction start and end dates
    let quarterStartDate = new Date();
    let quarterEndDate = new Date(course.finalExamDate);
    if (academicTerm && academicTerm in QUARTER_DATES) {
        quarterStartDate = new Date(QUARTER_DATES[academicTerm as keyof typeof QUARTER_DATES].start);
        quarterEndDate = new Date(QUARTER_DATES[academicTerm as keyof typeof QUARTER_DATES].end);
    }
    
    // Generate recurring dates for each day
    let events = "";

    for (const day of meeting.days) {
        const recurringDates = getRecurringDates(quarterStartDate, quarterEndDate, weekdays[day]);
        for (const date of recurringDates) {
            const start = new Date(date);
            start.setHours(startHour, startMin);

            const end = new Date(date);
            end.setHours(endHour, endMin);

            events += generateEventStr(course, meeting, start, end);
        }
    }
    
    return events;
}

function generateFinalExam(course: Course): string {
    const examStart = new Date(course.finalExamDate);
    const examEnd = new Date(examStart);
    examEnd.setHours(examEnd.getHours() + 2);

    const location = course.meetings.filter(m => m.type === "Lecture")[0].location;

    return generateEventStr(course, {
        type: "Final Exam",
        location: location
    }, examStart, examEnd);
}

function parseTime(timeStr: string): [number, number] {
    const [time, period] = timeStr.split(" ");
    let [hour, min] = time.split(":").map(Number);
    
    if (period === "PM" && hour !== 12) {
        hour += 12;
    } else if (period === "AM" && hour === 12) {
        hour = 0;
    }
    
    return [hour, min];
}

function getRecurringDates(startDate: Date, endDate: Date, dayOfWeek: number): Date[] {
    const dates = [];
    const current = new Date(startDate);
    
    while (current.getDay() !== dayOfWeek) {
        current.setDate(current.getDate() + 1);
    }
    
    // Generate dates until last day of instruction
    while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 7); // Next week
    }

    return dates;
}

function generateEventStr(course: Course, meeting: Record<string, string>, start: Date, end: Date): string {
    const event = [
        "BEGIN:VEVENT",
        `UID:${course.crn}_${meeting.type}_${start.toISOString()}`,
        `DTSTART:${formatICSDate(start)}`,
        `DTEND:${formatICSDate(end)}`,
        `SUMMARY:${course.shortTitle} - ${meeting.type}`,
        `DESCRIPTION:${course.fullTitle}\\nInstructor: ${course.instructor}\\nLocation: ${meeting.location}`,
        `LOCATION:${meeting.location}`,
        "END:VEVENT"
    ].join("\n") + "\n";

    return event;
}

function formatICSDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
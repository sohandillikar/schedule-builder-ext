import { TERM_CODES } from "@/lib/constants";
import { getProfessor } from "@/lib/courseUtils";

function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .results-title {
            width: 35% !important;
        }
        .results-instructor {
            width: 15% !important;
        }
    `;
    document.head.appendChild(style);
}

function extractAcademicTerm() {
    const urlParams = new URLSearchParams(window.location.search);
    const termCode = urlParams.get("termCode");

    if (!termCode) return null;

    const year = termCode?.slice(0, 4);
    const term = termCode?.slice(4);

    const academicTerm = TERM_CODES[term as keyof typeof TERM_CODES];

    if (!academicTerm) return null;

    return academicTerm + "_" + year;
}

function extractTitles(courseElement: Element) {
    const titles = courseElement.getElementsByClassName("classTitle")[0].textContent?.split(/-(.+)/);
    return {
        shortTitle: titles?.[0].trim(),
        fullTitle: titles?.[1].trim()
    };
}

function extractFromCourse(courseElement: Element, queries: Record<string, string>) {
    for (const child of courseElement.children) {
        const text = child.textContent?.trim();

        for (const [key, query] of Object.entries(queries)) {
            if (text?.includes(query))
                queries[key] = text.split(/:(.+)/)[1].trim();
        }
    }

    return queries;
}

function extractMeetings(couseElement: Element) {
    const meetings = [];
    const meetingElements = couseElement.getElementsByClassName("meeting");

    for (const meetingElement of meetingElements) {
        const meeting: Record<string, string | null | undefined> = {
            "type": meetingElement.getElementsByClassName("smallTitle")[0].textContent
        };
        for (let i = 1; i < meetingElement.children.length; i++) {
            const text = meetingElement.children[i].textContent?.trim();
            if (i === 1)
                meeting["time"] = text;
            else if (i === 2)
                meeting["days"] = text;
            else if (i === 3)
                meeting["location"] = text;
        }
        meetings.push(meeting);
    }
    return meetings;
}

function extractCourses() {
    const container = document.getElementById("SavedSchedulesListDisplayContainer");

    if (!container) {
        console.log("No saved schedules container found");
        return;
    }

    const courses = [];
    const courseItems = container.getElementsByClassName("CourseItem");

    for (const item of courseItems) {
        const { shortTitle, fullTitle } = extractTitles(item);
        const status = item.getElementsByClassName("statusIndicator")[0].textContent?.toLowerCase().trim();

        const { crn, units } = extractFromCourse(
            item.getElementsByClassName("left-side")[0],
            {
                "crn": "CRN:",
                "units": "Units:"
            }
        );

        const { instructor, description, finalExamDate, courseDropDate } = extractFromCourse(
            item.getElementsByClassName("classDescription")[0],
            {
                "instructor": "Instructor(s):",
                "description": "Description:",
                "finalExamDate": "Final Exam:",
                "courseDropDate": "Course Drop Date:"
            }
        );

        const meetings = extractMeetings(item);

        courses.push({
            shortTitle: shortTitle,
            fullTitle: fullTitle,
            status: status,
            crn: crn,
            units: units,
            instructor: instructor,
            description: description,
            finalExamDate: finalExamDate,
            courseDropDate: courseDropDate,
            meetings: meetings
        });
    }

    const academicTerm = extractAcademicTerm();

    chrome.runtime.sendMessage({
        action: "saveCourses",
        courses: courses,
        academicTerm: academicTerm
    });
}

function monitorCourseContainer() {
    const container = document.getElementById("SavedSchedulesListDisplayContainer");

    if (!container) {
        console.log("No saved schedules container found");
        return;
    }

    const observer = new MutationObserver(extractCourses);
    observer.observe(container, { childList: true, subtree: true });
}

function modifyDataColumnHeaders() {
    const dataColumns = document.querySelectorAll(".data-column.column-header.align-left");
    const titleColumns = Array.from(dataColumns).filter(column => column.textContent === "Title:");
    const instructorColumns = Array.from(dataColumns).filter(column => column.textContent === "Instructor(s):");

    titleColumns.forEach(column => (column as HTMLElement).style.width = "35%");

    instructorColumns.forEach(column => {
        const columnElement = column as HTMLElement;
        columnElement.innerHTML = `
            <div class="dropdown" style="display: inline-block;">
                <a class="dropdown-toggle" data-toggle="dropdown">
                    <button class="btn btn-mini white-on-navyblue">
                        <span>Instructor w/ Rating</span>
                        &nbsp;<b class="caret"></b>
                    </button>
                </a>
                <ul class="dropdown-menu defaultcase pull-right">
                    <li>
                        <a>All Instructors</a>
                        <a>Only 4/5 and above</a>
                        <a>Only 3/5 and above</a>
                        <a>Only 2/5 and above</a>
                        <a>Only 1/5 and above</a>
                    </li>
                </ul>
            </div>
        `;
        columnElement.style.width = "15%";
    });
}

function modifyFullTitleDiv(fullTitleDiv: HTMLElement, shortTitle: string) {
    let [dept, classCode, secCode] = shortTitle.split(" ");
    if (classCode[0] === "0")
        classCode = classCode.slice(1);

    const courseId = `${dept}${classCode}`;
    const courseUrl = `https://daviscattlelog.com/course/${courseId}`;

    fullTitleDiv.style.textDecoration = "underline dashed";
    fullTitleDiv.style.textUnderlineOffset = "4px";
    fullTitleDiv.style.cursor = "pointer";
    fullTitleDiv.onclick = () => window.open(courseUrl!, '_blank');
    fullTitleDiv.title = "View class on Cattlelog";
}

function modifyInstructorDiv(instructorDiv: Element) {
    const instructor = instructorDiv.textContent?.trim();

    if (instructor === ".. The Staff") return;

    const professor = getProfessor(instructor!);

    if (!professor) return;

    const rating = professor.overall_rating;
    const instructorUrl = `https://daviscattlelog.com/professor/${professor.slug}`;

    instructorDiv.innerHTML = `
        <p
        class="alert ${rating >= 4 ? "alert-success" : rating < 3 ? "alert-danger" : ""}"
        title="View instructor on Cattlelog"
        style="display:inline-block; text-decoration: underline dashed; text-underline-offset: 4px; cursor: pointer;"
        onclick="window.open('${instructorUrl}', '_blank')">
            ${instructor}: ${rating}/5
        </p>
    `;
}

function modifySearchResults() {
    modifyDataColumnHeaders();

    const searchResults = document.getElementsByClassName("course-details");
    const editedByExtIdentifier = "edited-by-extension";

    for (const result of searchResults) {
        const shortTitle = result.getElementsByClassName("results-subj")[0].textContent?.trim();
        const fullTitleDiv = result.getElementsByClassName("results-title")[0] as HTMLElement;
        const instructorDiv = result.getElementsByClassName("results-instructor")[0];

        if (!fullTitleDiv.classList.contains(editedByExtIdentifier)) {
            modifyFullTitleDiv(fullTitleDiv, shortTitle!);
            fullTitleDiv.classList.add(editedByExtIdentifier);
        }

        if (!instructorDiv.classList.contains(editedByExtIdentifier)) {
            modifyInstructorDiv(instructorDiv);
            instructorDiv.classList.add(editedByExtIdentifier);
        }
    }
}

function monitorSearchResults() {
    const searchResultsDiv = document.getElementById("courseResultsDiv");
    const inlineSearchResultsDiv = document.getElementById("inlineCourseResultsDiv");

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            const target = mutation.target as Element;
            if (["courseResultsDiv", "inlineCourseResultsDiv"].includes(target.id)) {
                modifySearchResults();
                return;
            }
        }
    });

    if (searchResultsDiv)
        observer.observe(searchResultsDiv, { childList: true, subtree: true });
    if (inlineSearchResultsDiv)
        observer.observe(inlineSearchResultsDiv, { childList: true, subtree: true });
}

injectStyles();
monitorCourseContainer();
monitorSearchResults();

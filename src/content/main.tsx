function extractTitles(courseElement: Element) {
    const titles = courseElement.getElementsByClassName("classTitle")[0].textContent?.split(" - ");
    return {
        shortTitle: titles?.[0],
        fullTitle: titles?.[1]
    };
}

function extractFromCourse(courseElement: Element, queries: Record<string, string>) {
    for (const child of courseElement.children) {
        const text = child.textContent?.trim();

        for (const [key, query] of Object.entries(queries)) {
            if (text?.includes(query))
                queries[key] = text.split(":")[1].trim();
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

        const { instructor, description, courseDropDate } = extractFromCourse(
            item.getElementsByClassName("classDescription")[0],
            {
                "instructor": "Instructor(s):",
                "description": "Description:",
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
            courseDropDate: courseDropDate,
            meetings: meetings
        });
    }

    chrome.runtime.sendMessage({
        action: "saveCourses",
        courses: courses
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

monitorCourseContainer();

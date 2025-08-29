import{g as C,T as b}from"./courseUtils-Bbv0IdLz.js";globalThis.minInstructorRating=0;function E(){const n=document.createElement("style");n.textContent=`
        .results-title {
            width: 35% !important;
        }
        .results-instructor {
            width: 15% !important;
        }
    `,document.head.appendChild(n)}function v(){const t=new URLSearchParams(window.location.search).get("termCode");if(!t)return null;const s=t==null?void 0:t.slice(0,4),e=t==null?void 0:t.slice(4),r=b[e];return r?r+"_"+s:null}function x(n){var s;const t=(s=n.getElementsByClassName("classTitle")[0].textContent)==null?void 0:s.split(/-(.+)/);return{shortTitle:t==null?void 0:t[0].trim(),fullTitle:t==null?void 0:t[1].trim()}}function c(n,t){var s;for(const e of n.children){const r=(s=e.textContent)==null?void 0:s.trim();for(const[o,i]of Object.entries(t))r!=null&&r.includes(i)&&(t[o]=r.split(/:(.+)/)[1].trim())}return t}function w(n){var e;const t=[],s=n.getElementsByClassName("meeting");for(const r of s){const o={type:r.getElementsByClassName("smallTitle")[0].textContent};for(let i=1;i<r.children.length;i++){const a=(e=r.children[i].textContent)==null?void 0:e.trim();i===1?o.time=a:i===2?o.days=a:i===3&&(o.location=a)}t.push(o)}return t}function I(){var r;const n=document.getElementById("SavedSchedulesListDisplayContainer");if(!n){console.log("No saved schedules container found");return}const t=[],s=n.getElementsByClassName("CourseItem");for(const o of s){const{shortTitle:i,fullTitle:a}=x(o),l=(r=o.getElementsByClassName("statusIndicator")[0].textContent)==null?void 0:r.toLowerCase().trim(),{crn:d,units:m}=c(o.getElementsByClassName("left-side")[0],{crn:"CRN:",units:"Units:"}),{instructor:f,description:g,finalExamDate:h,courseDropDate:y}=c(o.getElementsByClassName("classDescription")[0],{instructor:"Instructor(s):",description:"Description:",finalExamDate:"Final Exam:",courseDropDate:"Course Drop Date:"}),p=w(o);t.push({shortTitle:i,fullTitle:a,status:l,crn:d,units:m,instructor:f,description:g,finalExamDate:h,courseDropDate:y,meetings:p})}const e=v();chrome.runtime.sendMessage({action:"saveCourses",courses:t,academicTerm:e})}function B(){const n=document.getElementById("SavedSchedulesListDisplayContainer");if(!n){console.log("No saved schedules container found");return}new MutationObserver(I).observe(n,{childList:!0,subtree:!0})}function D(n){Array.from(document.getElementsByClassName("instructor-filter-btn")).forEach(s=>{const e=s.querySelector("span");n===0?e.textContent="Instructor w/ Rating":e.textContent=`Instructor w/ ${n}/5+ Rating`}),globalThis.minInstructorRating=n,u()}function R(){const n=document.querySelectorAll(".data-column.column-header.align-left"),t=Array.from(n).filter(e=>e.textContent==="Title:"),s=Array.from(n).filter(e=>e.textContent==="Instructor(s):");t.forEach(e=>e.style.width="35%"),s.forEach(e=>{const r=e;r.innerHTML=`
            <div class="dropdown" style="display: inline-block;">
                <a class="dropdown-toggle" data-toggle="dropdown">
                    <button class="btn btn-mini white-on-navyblue instructor-filter-btn">
                        <span>Instructor w/ Rating</span>
                        &nbsp;<b class="caret"></b>
                    </button>
                </a>
                <ul class="dropdown-menu defaultcase pull-right">
                    <li><a href="#" data-min-rating="0">All Instructors</a></li>
                    <li><a href="#" data-min-rating="4">Only 4/5 and above</a></li>
                    <li><a href="#" data-min-rating="3">Only 3/5 and above</a></li>
                    <li><a href="#" data-min-rating="2">Only 2/5 and above</a></li>
                    <li><a href="#" data-min-rating="1">Only 1/5 and above</a></li>
                </ul>
            </div>
        `,r.querySelectorAll("[data-min-rating]").forEach(i=>i.addEventListener("click",a=>{const l=parseInt(a.target.getAttribute("data-min-rating"));D(l)})),r.style.width="15%"})}function T(n,t){let[s,e,r]=t.split(" ");e[0]==="0"&&(e=e.slice(1));const i=`https://daviscattlelog.com/course/${`${s}${e}`}`;n.style.textDecoration="underline dashed",n.style.textUnderlineOffset="4px",n.style.cursor="pointer",n.onclick=()=>window.open(i,"_blank"),n.title="View class on Cattlelog"}function L(n){var o;const t=(o=n.textContent)==null?void 0:o.trim();if(t===".. The Staff")return;const s=C(t);if(!s)return;const e=s.overall_rating,r=`https://daviscattlelog.com/professor/${s.slug}`;n.innerHTML=`
        <p
        class="alert ${e>=4?"alert-success":e<3?"alert-danger":""}"
        title="View instructor on Cattlelog"
        style="display:inline-block; text-decoration: underline dashed; text-underline-offset: 4px; cursor: pointer;"
        onclick="window.open('${r}', '_blank')">
            ${t}: ${e}/5
        </p>
    `}function N(n){var e;if(globalThis.minInstructorRating===0)return!0;const t=(e=n.textContent)==null?void 0:e.trim();return t===".. The Staff"?!1:parseFloat(t==null?void 0:t.split(": ")[1].split("/")[0])>=globalThis.minInstructorRating}function u(){var s;const n=document.getElementsByClassName("course-container"),t="edited-by-extension";for(const e of n){const r=(s=e.getElementsByClassName("results-subj")[0].textContent)==null?void 0:s.trim(),o=e.getElementsByClassName("results-title")[0],i=e.getElementsByClassName("results-instructor")[0];o.classList.contains(t)||(T(o,r),o.classList.add(t)),i.classList.contains(t)||(L(i),i.classList.add(t)),N(i)?e.classList.remove("hide"):e.classList.add("hide")}}function S(){const n=document.getElementById("courseResultsDiv"),t=document.getElementById("inlineCourseResultsDiv"),s=new MutationObserver(e=>{for(const r of e){const o=r.target;if(["courseResultsDiv","inlineCourseResultsDiv"].includes(o.id)){R(),u();return}}});n&&s.observe(n,{childList:!0,subtree:!0}),t&&s.observe(t,{childList:!0,subtree:!0})}E();B();S();

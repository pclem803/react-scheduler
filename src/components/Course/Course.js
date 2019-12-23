import React from "react";
import "rbx/index.css";
import { Button } from "rbx";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import timeConflict from './time.js'

const firebaseConfig = {
    apiKey: "AIzaSyDYG808hC39v9kavfsdAsCW84tuXPNCmyA",
    authDomain: "react-schedulizer.firebaseapp.com",
    databaseURL: "https://react-schedulizer.firebaseio.com",
    projectId: "react-schedulizer",
    storageBucket: "react-schedulizer.appspot.com",
    messagingSenderId: "1067341162501",
    appId: "1:1067341162501:web:245467b1d3f51f864b546c",
    measurementId: "G-2ZNZRBW13Y"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database().ref();

const Course = ({ course, state }) => (
    <Button
      color={buttonColor(state.selected.includes(course))}
      onClick={() => state.toggle(course)}
      onDoubleClick={() => moveCourse(course)}
      disabled={hasConflict(course, state.selected)}
    >
      {getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
    </Button>
);

const moveCourse = course => {
    const meets = prompt("Enter new meeting data, in this format:", course.meets);
    if (!meets) return;
    const { days } = timeParts(meets);
    if (days) saveCourse(course, meets);
    else moveCourse(course);
};

// a conflict must involve overlapping days and times

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match
    ? {}
    : {
        days,
        hours: {
          start: hh1 * 60 + mm1 * 1,
          end: hh2 * 60 + mm2 * 1
        }
      };
};

const saveCourse = (course, meets) => {
    db.child("courses")
      .child(course.id)
      .update({ meets })
      .catch(error => alert(error));
};

const terms = {
    F: "Fall",
    W: "Winter",
    S: "Spring"
};
  
const getCourseTerm = course => terms[course.id.charAt(0)];

const getCourseNumber = course => course.id.slice(1, 4);

const hasConflict = (course, selected) =>
  selected.some(selection => courseConflict(course, selection));

const buttonColor = selected => (selected ? "success" : null);

const courseConflict = (course1, course2) =>
  course1 !== course2 &&
  getCourseTerm(course1) === getCourseTerm(course2) &&
  timeConflict(course1, course2);

export default Course
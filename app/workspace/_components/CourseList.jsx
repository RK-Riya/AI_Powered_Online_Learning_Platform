"use client";
import React, { useState } from "react";
import Image from "next/image";
 // make sure Button is imported

function CourseList() {
  const [courseList, setCourseList] = useState([]);

  return (
    <div className="mt-12">
      <h2 className="font-bold text-3xl">CourseList</h2>

      {courseList?.length === 0 ? (
        <div className="flex flex-col p-5 items-center justify-center bg-secondary rounded-2xl">
          <Image
            src="/online-education.png" // path should start with "/" if from public/
            alt="education"
            width={80}
            height={80}
          />
          <h2 className="my-2 text-lg">No course created by you yet...</h2>
          
        </div>
      ) : (
        <div>List of Courses</div>
      )}
    </div>
  );
}

export default CourseList;

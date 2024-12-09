"use client";

import React, { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import type { CourseSectionProps } from "../types";

export const CourseSection = ({
  title,
  required,
  courses = [],
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
}: CourseSectionProps) => {
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState("");

  const handleAdd = () => {
    if (
      newCourseName.trim() &&
      newCourseCredits &&
      Number(newCourseCredits) >= 0 &&
      Number.isInteger(Number(newCourseCredits))
    ) {
      onAddCourse({
        id: Math.random().toString(36).substr(2, 9),
        name: newCourseName.trim(),
        credits: Number(newCourseCredits),
      });
      setNewCourseName("");
      setNewCourseCredits("");
    }
  };

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const remaining = Math.max(0, required - totalCredits);

  return (
    <div className="space-y-2 bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium text-sm text-gray-900">
          {title} ({totalCredits}/{required}학점)
        </div>
        <div
          className={`text-sm font-medium ${
            remaining > 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          잔여: {remaining}학점
        </div>
      </div>

      {/* 기존 과목 목록 */}
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center space-x-2">
            <input
              value={course.name}
              onChange={(e) =>
                onUpdateCourse(course.id, { ...course, name: e.target.value })
              }
              placeholder="과목명"
              className="flex-1 px-3 py-2 border rounded-md text-gray-900 bg-white"
            />
            <input
              type="number"
              min="0"
              step="1"
              value={course.credits}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (Number(value) >= 0 && Number.isInteger(Number(value)))
                ) {
                  onUpdateCourse(course.id, {
                    ...course,
                    credits: Number(value) || 0,
                  });
                }
              }}
              placeholder="학점"
              className="w-20 px-3 py-2 border rounded-md text-gray-900 bg-white"
            />
            <button
              onClick={() => onRemoveCourse(course.id)}
              className="p-2 text-red-500 hover:text-red-700 bg-white rounded-md hover:bg-red-50"
            >
              <MinusCircle className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* 새 과목 추가 */}
      <div className="flex items-center space-x-2 mt-3">
        <input
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          placeholder="새 과목명"
          className="flex-1 px-3 py-2 border rounded-md text-gray-900 bg-white"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={newCourseCredits}
          onChange={(e) => {
            const value = e.target.value;
            if (
              value === "" ||
              (Number(value) >= 0 && Number.isInteger(Number(value)))
            ) {
              setNewCourseCredits(value);
            }
          }}
          placeholder="학점"
          className="w-20 px-3 py-2 border rounded-md text-gray-900 bg-white"
        />
        <button
          onClick={handleAdd}
          className="p-2 text-blue-500 hover:text-blue-700 bg-white rounded-md hover:bg-blue-50"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CourseSection;

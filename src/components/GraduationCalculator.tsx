"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Course, CourseType, CoursesByType } from "../types";
import {
  GRADUATION_REQUIREMENTS,
  MAJOR_TYPES,
  TOTAL_REQUIRED_CREDITS,
  TEACHING_ADDITIONAL_CREDITS,
} from "../constants";
import CourseSection from "./CourseSection";
import styled from "styled-components";

const GraduationCalculator = () => {
  // 기본값으로 초기화
  const [majorType, setMajorType] = useState("single");
  const [isTeachingMajor, setIsTeachingMajor] = useState(false);
  const [coursesByType, setCoursesByType] = useState<CoursesByType>({
    기교: [],
    심교: [],
    전필: [],
    전선: [],
    일선: [],
    다지: [],
    다필선: [],
    부필선: [],
    교생실습: [],
  });

  // localStorage에서 데이터를 불러오는 부분을 useEffect로 이동
  useEffect(() => {
    const savedMajorType = localStorage.getItem("majorType");
    if (savedMajorType) setMajorType(savedMajorType);

    const savedIsTeachingMajor = localStorage.getItem("isTeachingMajor");
    if (savedIsTeachingMajor)
      setIsTeachingMajor(savedIsTeachingMajor === "true");

    const savedCourses = localStorage.getItem("coursesByType");
    if (savedCourses) setCoursesByType(JSON.parse(savedCourses));
  }, []);

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem("majorType", majorType);
    localStorage.setItem("isTeachingMajor", isTeachingMajor.toString());
    localStorage.setItem("coursesByType", JSON.stringify(coursesByType));
  }, [majorType, isTeachingMajor, coursesByType]);

  const handleAddCourse = (type: CourseType, course: Course) => {
    setCoursesByType((prev) => ({
      ...prev,
      [type]: [...prev[type], course],
    }));
  };

  const handleRemoveCourse = (type: CourseType, courseId: string) => {
    setCoursesByType((prev) => ({
      ...prev,
      [type]: prev[type].filter((course) => course.id !== courseId),
    }));
  };

  const handleUpdateCourse = (
    type: CourseType,
    courseId: string,
    updatedCourse: Course
  ) => {
    setCoursesByType((prev) => ({
      ...prev,
      [type]: prev[type].map((course) =>
        course.id === courseId ? updatedCourse : course
      ),
    }));
  };

  const getTotalCompleted = () => {
    return Object.values(coursesByType).reduce(
      (sum, courses) =>
        sum +
        courses.reduce((courseSum, course) => courseSum + course.credits, 0),
      0
    );
  };

  const getTotalRequired = () => {
    let total = TOTAL_REQUIRED_CREDITS;
    if (isTeachingMajor) total += TEACHING_ADDITIONAL_CREDITS;
    return total;
  };

  const getTotalRemaining = () => {
    return Math.max(0, getTotalRequired() - getTotalCompleted());
  };

  const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem;

    @media (min-width: 850px) and (max-width: 1299px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1300px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  `;

  return (
    <div className="max-w-screen-xl mx-auto bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      {/* 학위 유형 선택 */}
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-6">
        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
          {MAJOR_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setMajorType(type.id)}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                majorType === type.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-900 hover:bg-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 px-2">
          <input
            type="checkbox"
            id="teachingMajor"
            checked={isTeachingMajor}
            onChange={(e) => setIsTeachingMajor(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="teachingMajor" className="text-gray-900">
            교직이수
          </label>
        </div>
      </div>

      {/* 이수구분별 과목 입력 섹션 */}
      <GridContainer>
        {Object.keys(GRADUATION_REQUIREMENTS).map((type) => (
          <CourseSection
            key={type}
            title={type}
            required={GRADUATION_REQUIREMENTS[type as CourseType]}
            courses={coursesByType[type as CourseType]}
            onAddCourse={(course) =>
              handleAddCourse(type as CourseType, course)
            }
            onRemoveCourse={(courseId) =>
              handleRemoveCourse(type as CourseType, courseId)
            }
            onUpdateCourse={(courseId, course) =>
              handleUpdateCourse(type as CourseType, courseId, course)
            }
          />
        ))}
      </GridContainer>

      {/* 전체 학점 요약 */}
      <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">전체 이수현황</h3>
          </div>
          <div className="text-sm text-gray-900">
            기준: {getTotalRequired()}학점
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">취득</div>
            <div className="text-2xl font-bold text-gray-900">
              {getTotalCompleted()}학점
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">잔여</div>
            <div
              className={`text-2xl font-bold ${
                getTotalRemaining() > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {getTotalRemaining()}학점
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduationCalculator;

"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Course } from "../types";
import {
  GRADUATION_REQUIREMENTS,
  MAJOR_TYPES,
  TOTAL_REQUIRED_CREDITS,
  TEACHING_ADDITIONAL_CREDITS,
} from "../constants";
import CourseSection from "./CourseSection";

const GraduationCalculator = () => {
  // 기본값으로 초기화
  const [majorType, setMajorType] = useState("single");
  const [isTeachingMajor, setIsTeachingMajor] = useState(false);
  const [coursesByType, setCoursesByType] = useState({
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

  const handleAddCourse = (type: string, course: Course) => {
    setCoursesByType((prev) => ({
      ...prev,
      [type]: [...prev[type], course],
    }));
  };

  const handleRemoveCourse = (type: string, courseId: string) => {
    setCoursesByType((prev) => ({
      ...prev,
      [type]: prev[type].filter((course) => course.id !== courseId),
    }));
  };

  const handleUpdateCourse = (
    type: string,
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

  return (
    <div className="max-w-4xl mx-auto bg-slate-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-2xl font-bold text-center text-gray-900 mb-6">
          졸업학점 계산기
        </div>

        <div className="space-y-6">
          {/* 학위 유형 선택 */}
          <div className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CourseSection
              title="기초교양"
              required={GRADUATION_REQUIREMENTS.기교}
              courses={coursesByType.기교}
              onAddCourse={(course) => handleAddCourse("기교", course)}
              onRemoveCourse={(courseId) =>
                handleRemoveCourse("기교", courseId)
              }
              onUpdateCourse={(courseId, course) =>
                handleUpdateCourse("기교", courseId, course)
              }
            />
            <CourseSection
              title="심화교양"
              required={GRADUATION_REQUIREMENTS.심교}
              courses={coursesByType.심교}
              onAddCourse={(course) => handleAddCourse("심교", course)}
              onRemoveCourse={(courseId) =>
                handleRemoveCourse("심교", courseId)
              }
              onUpdateCourse={(courseId, course) =>
                handleUpdateCourse("심교", courseId, course)
              }
            />
            <CourseSection
              title="전공필수"
              required={GRADUATION_REQUIREMENTS.전필}
              courses={coursesByType.전필}
              onAddCourse={(course) => handleAddCourse("전필", course)}
              onRemoveCourse={(courseId) =>
                handleRemoveCourse("전필", courseId)
              }
              onUpdateCourse={(courseId, course) =>
                handleUpdateCourse("전필", courseId, course)
              }
            />
            <CourseSection
              title="전공선택"
              required={GRADUATION_REQUIREMENTS.전선}
              courses={coursesByType.전선}
              onAddCourse={(course) => handleAddCourse("전선", course)}
              onRemoveCourse={(courseId) =>
                handleRemoveCourse("전선", courseId)
              }
              onUpdateCourse={(courseId, course) =>
                handleUpdateCourse("전선", courseId, course)
              }
            />
            <CourseSection
              title="일반선택"
              required={GRADUATION_REQUIREMENTS.일선}
              courses={coursesByType.일선}
              onAddCourse={(course) => handleAddCourse("일선", course)}
              onRemoveCourse={(courseId) =>
                handleRemoveCourse("일선", courseId)
              }
              onUpdateCourse={(courseId, course) =>
                handleUpdateCourse("일선", courseId, course)
              }
            />

            {majorType === "double" && (
              <>
                <CourseSection
                  title="다전공지정"
                  required={GRADUATION_REQUIREMENTS.다지}
                  courses={coursesByType.다지}
                  onAddCourse={(course) => handleAddCourse("다지", course)}
                  onRemoveCourse={(courseId) =>
                    handleRemoveCourse("다지", courseId)
                  }
                  onUpdateCourse={(courseId, course) =>
                    handleUpdateCourse("다지", courseId, course)
                  }
                />
                <CourseSection
                  title="다전공 필수/선택"
                  required={GRADUATION_REQUIREMENTS.다필선}
                  courses={coursesByType.다필선}
                  onAddCourse={(course) => handleAddCourse("다필선", course)}
                  onRemoveCourse={(courseId) =>
                    handleRemoveCourse("다필선", courseId)
                  }
                  onUpdateCourse={(courseId, course) =>
                    handleUpdateCourse("다필선", courseId, course)
                  }
                />
              </>
            )}

            {majorType === "minor" && (
              <CourseSection
                title="부전공 필수/선택"
                required={GRADUATION_REQUIREMENTS.부필선}
                courses={coursesByType.부필선}
                onAddCourse={(course) => handleAddCourse("부필선", course)}
                onRemoveCourse={(courseId) =>
                  handleRemoveCourse("부필선", courseId)
                }
                onUpdateCourse={(courseId, course) =>
                  handleUpdateCourse("부필선", courseId, course)
                }
              />
            )}

            {isTeachingMajor && (
              <CourseSection
                title="교직이수(+교생실습)"
                required={GRADUATION_REQUIREMENTS.교생실습}
                courses={coursesByType.교생실습}
                onAddCourse={(course) => handleAddCourse("교생실습", course)}
                onRemoveCourse={(courseId) =>
                  handleRemoveCourse("교생실습", courseId)
                }
                onUpdateCourse={(courseId, course) =>
                  handleUpdateCourse("교생실습", courseId, course)
                }
              />
            )}
          </div>

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
      </div>
    </div>
  );
};

export default GraduationCalculator;

// types.ts
export type Course = {
  id: string;
  name: string;
  credits: number;
};

export type CourseSectionProps = {
  title: string;
  required: number;
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onRemoveCourse: (courseId: string) => void;
  onUpdateCourse: (courseId: string, course: Course) => void;
};

export type CourseType =
  | "기교"
  | "심교"
  | "전필"
  | "전선"
  | "일선"
  | "다지"
  | "다필선"
  | "부필선"
  | "교생실습";

export type CoursesByType = {
  [key in CourseType]: Course[];
};

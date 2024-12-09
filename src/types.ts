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

export type CoursesByType = {
  기교: Course[];
  심교: Course[];
  전필: Course[];
  전선: Course[];
  일선: Course[];
  다지: Course[];
  다필선: Course[];
  부필선: Course[];
  교생실습: Course[];
};

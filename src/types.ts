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

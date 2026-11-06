import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  BookOpen,
  Building2,
} from "lucide-react";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: "graduation" | "faculty" | "campus";
  enabled: boolean;
}

export const mockWorkspaces: Workspace[] = [
  {
    id: "student-records",
    name: "Student Records",
    description:
      "Enrollment, transcripts, and student lifecycle management.",
    icon: "graduation",
    enabled: true,
  },
  {
    id: "faculty-portal",
    name: "Faculty Portal",
    description:
      "Course rosters, grading, and faculty onboarding tools.",
    icon: "faculty",
    enabled: true,
  },
  {
    id: "campus-operations",
    name: "Campus Operations",
    description:
      "Facilities, housing, and campus services administration.",
    icon: "campus",
    enabled: true,
  },
];

export const workspaceIcons: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  faculty: BookOpen,
  campus: Building2,
};
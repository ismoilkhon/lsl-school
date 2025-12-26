export type UserRole = "admin" | "teacher" | "student" | "parent";

export type DashboardMenuItem = {
  icon: string;
  label: string;
  href: string;
  roles: UserRole[];
  action?: "logout";
};

export type DashboardMenuSection = {
  title: string;
  items: DashboardMenuItem[];
};

export const dashboardMenuSections: DashboardMenuSection[] = [
  {
    title: "MAIN",
    items: [
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        roles: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        roles: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        roles: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        roles: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        roles: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendances",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        roles: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "#",
        roles: ["admin", "teacher", "student", "parent"],
        action: "logout",
      },
    ],
  },
];

const baseRolePrefixes: Record<UserRole, string[]> = {
  admin: ["/admin", "/list"],
  teacher: ["/teacher"],
  student: ["/student"],
  parent: ["/parent"],
};

const directRouteRolesMap = new Map<string, Set<UserRole>>();

dashboardMenuSections.forEach((section) => {
  section.items.forEach((item) => {
    if (item.action === "logout") return;
    if (!item.href.startsWith("/")) return;
    const roles = directRouteRolesMap.get(item.href) ?? new Set<UserRole>();
    item.roles.forEach((role) => roles.add(role));
    directRouteRolesMap.set(item.href, roles);
  });
});

const toSortedRoles = (roles: Set<UserRole>): UserRole[] =>
  Array.from(roles).sort((a, b) => a.localeCompare(b));

const directRouteAccessMap = Object.fromEntries(
  Array.from(directRouteRolesMap.entries()).map(([path, roles]) => [
    path,
    toSortedRoles(roles),
  ])
) as Record<string, UserRole[]>;

const wildcardRouteAccess: Record<string, UserRole[]> = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
};

export const routeAccessMap: Record<string, UserRole[]> = {
  ...directRouteAccessMap,
  ...wildcardRouteAccess,
};

const getRoutesForRole = (role: UserRole): string[] =>
  Array.from(directRouteRolesMap.entries())
    .filter(([, roles]) => roles.has(role))
    .map(([path]) => path);

const unique = (values: string[]) => Array.from(new Set(values));

export const roleRoutes: Record<UserRole, string[]> = {
  admin: unique([...baseRolePrefixes.admin, ...getRoutesForRole("admin")]),
  teacher: unique([...baseRolePrefixes.teacher, ...getRoutesForRole("teacher")]),
  student: unique([...baseRolePrefixes.student, ...getRoutesForRole("student")]),
  parent: unique([...baseRolePrefixes.parent, ...getRoutesForRole("parent")]),
};


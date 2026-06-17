import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  CheckCircle2,
  UserPlus,
  AlertCircle,
  Wallet,
  BookOpen,
  Layers,
  Calendar,
} from "lucide-react";
import { Student, Course, Batch, Payment } from "@/types";
import { SectionHeader, StatCard, Card, StatusBadge as Badge } from "@/components/shared";
import { FMT, formatCurrentDateTime, getTimeGreeting } from "@/lib/utils";
import { useCurrentDateTime } from "@/hooks/useCurrentDateTime";
import {
  buildEnrollmentTrend,
  buildFeeTrend,
  buildCoursePie,
  buildTodayClasses,
  type ChartPoint,
  type PieSlice,
  type TodayClass,
} from "@/lib/dashboardStats";
import { API_ENABLED } from "@/api/config";
import { dashboardService, type DashboardStats } from "@/api/services/dashboard.service";

function buildStatsFromStore(
  students: Student[],
  courses: Course[],
  batches: Batch[],
  todayClasses: TodayClass[]
): DashboardStats {
  const now = new Date();
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const totalPaid = students.reduce((sum, s) => sum + s.feesPaid, 0);
  const totalDue = students.reduce((sum, s) => sum + Math.max(0, s.feesTotal - s.feesPaid), 0);
  const newAdmissions = students.filter((s) => {
    const d = new Date(s.admissionDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  return {
    totalStudents: students.length,
    activeStudents,
    newAdmissionsThisMonth: newAdmissions,
    feesDue: totalDue,
    feesCollected: totalPaid,
    studentsWithFeesDue: students.filter((s) => s.feesPaid < s.feesTotal).length,
    totalCourses: courses.length,
    activeCourses: courses.filter((c) => c.status === "Active").length,
    upcomingBatches: batches.filter((b) => b.status === "Upcoming").length,
    ongoingBatches: batches.filter((b) => b.status === "Ongoing").length,
    todayClassesCount: todayClasses.length,
    ongoingClassesNow: todayClasses.filter((c) => c.status === "Ongoing").length,
    totalFaculty: 0,
    totalRevenue: totalPaid,
  };
}

export function DashboardPage({
  students,
  courses,
  batches,
  payments,
  settings,
}: {
  students: Student[];
  courses: Course[];
  batches: Batch[];
  payments: Payment[];
  settings: { name: string };
}) {
  const [enrollmentData, setEnrollmentData] = useState<ChartPoint[]>(() =>
    buildEnrollmentTrend(students)
  );
  const [feeData, setFeeData] = useState<ChartPoint[]>(() =>
    buildFeeTrend(students, payments)
  );
  const [coursePie, setCoursePie] = useState<PieSlice[]>(() =>
    buildCoursePie(students, courses)
  );
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>(() =>
    buildTodayClasses(batches)
  );
  const [stats, setStats] = useState<DashboardStats>(() =>
    buildStatsFromStore(students, courses, batches, buildTodayClasses(batches))
  );

  useEffect(() => {
    if (!API_ENABLED) {
      const classes = buildTodayClasses(batches);
      setEnrollmentData(buildEnrollmentTrend(students));
      setFeeData(buildFeeTrend(students, payments));
      setCoursePie(buildCoursePie(students, courses));
      setTodayClasses(classes);
      setStats(buildStatsFromStore(students, courses, batches, classes));
      return;
    }

    let cancelled = false;
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getEnrollmentTrend(),
      dashboardService.getFeeTrend(),
      dashboardService.getCourseEnrollment(),
      dashboardService.getTodayClasses(),
    ])
      .then(([apiStats, enrollment, fees, pie, classes]) => {
        if (cancelled) return;
        setStats(apiStats);
        if (enrollment.length) setEnrollmentData(enrollment);
        if (fees.length) setFeeData(fees);
        if (pie.length) setCoursePie(pie);
        setTodayClasses(classes);
      })
      .catch(() => {
        if (cancelled) return;
        const classes = buildTodayClasses(batches);
        setEnrollmentData(buildEnrollmentTrend(students));
        setFeeData(buildFeeTrend(students, payments));
        setCoursePie(buildCoursePie(students, courses));
        setTodayClasses(classes);
        setStats(buildStatsFromStore(students, courses, batches, classes));
      });

    return () => {
      cancelled = true;
    };
  }, [students, courses, batches, payments]);

  const now = useCurrentDateTime();
  const instituteName = settings.name.split(" ")[0] || "your institute";

  return (
    <div>
      <SectionHeader
        title={getTimeGreeting(now)}
        subtitle={`Welcome back! Here's what's happening at ${instituteName} today.`}
        action={
          <p className="text-xs text-muted-foreground text-right hidden sm:block">
            {formatCurrentDateTime(now)}
          </p>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-5">
        <StatCard icon={Users} label="Total Students" value={String(stats.totalStudents)} sub="Across all courses" color="bg-primary" />
        <StatCard icon={CheckCircle2} label="Active Students" value={String(stats.activeStudents)} sub="Currently enrolled" color="bg-emerald-600" />
        <StatCard icon={UserPlus} label="New Admissions" value={String(stats.newAdmissionsThisMonth)} sub={now.toLocaleString("en-IN", { month: "long" }) + " " + now.getFullYear()} color="bg-violet-600" />
        <StatCard icon={AlertCircle} label="Fees Due" value={FMT.format(stats.feesDue)} sub={`From ${stats.studentsWithFeesDue} students`} color="bg-red-500" />
        <StatCard icon={Wallet} label="Fees Collected" value={FMT.format(stats.feesCollected)} sub="This academic year" color="bg-amber-600" />
        <StatCard icon={BookOpen} label="Total Courses" value={String(stats.totalCourses)} sub={`${stats.activeCourses} active`} color="bg-teal-600" />
        <StatCard icon={Layers} label="Upcoming Batches" value={String(stats.upcomingBatches)} sub={`${stats.ongoingBatches} ongoing`} color="bg-indigo-600" />
        <StatCard icon={Calendar} label="Today's Classes" value={String(stats.todayClassesCount)} sub={`${stats.ongoingClassesNow} ongoing now`} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Student Enrollment Trend</h3>
            <span className="text-xs text-muted-foreground">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={enrollmentData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }} />
              <Area isAnimationActive={false} type="monotone" dataKey="students" stroke="#1a3a5c" strokeWidth={2} fill="#1a3a5c" fillOpacity={0.1} name="Students" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Enrollment by Course</h3>
          {coursePie.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No enrollments yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie isAnimationActive={false} data={coursePie} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                    {coursePie.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1">
                {coursePie.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-muted-foreground">{name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Fee Collection vs Due</h3>
            <span className="text-xs text-muted-foreground">Monthly overview</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={feeData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => FMT.format(v)} />
              <Bar isAnimationActive={false} dataKey="collected" fill="#1a3a5c" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar isAnimationActive={false} dataKey="due" fill="#c0392b" radius={[4, 4, 0, 0]} name="Due" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Today&apos;s Classes</h3>
          {todayClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No ongoing batches scheduled</p>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div key={`${cls.batch}-${cls.time}`} className="flex items-start gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cls.status === "Ongoing" ? "bg-emerald-500" : cls.status === "Completed" ? "bg-blue-400" : "bg-amber-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">{cls.course}</div>
                    <div className="text-xs text-muted-foreground">{cls.time}</div>
                    <div className="text-xs text-muted-foreground">{cls.faculty} · {cls.batch}</div>
                  </div>
                  <Badge status={cls.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;

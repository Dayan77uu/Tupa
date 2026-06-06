import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export function ManagerDashboard() {
  const stats = [
    { title: "Trámites procesados (mes)", value: "245", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50", trend: "+12%" },
    { title: "Tiempo promedio (días)", value: "8.5", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", trend: "-15%" },
    { title: "Trámites vencidos", value: "12", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50", trend: "+5%" },
    { title: "Tasa de aprobación", value: "87%", icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", trend: "+3%" },
  ];

  const monthlyData = [
    { month: "Ene", tramites: 180 },
    { month: "Feb", tramites: 210 },
    { month: "Mar", tramites: 195 },
    { month: "Abr", tramites: 230 },
    { month: "May", tramites: 245 },
  ];

  const procedureData = [
    { name: "Certificado de estudios", value: 85 },
    { name: "Constancia de estudios", value: 120 },
    { name: "Grado de Bachiller", value: 15 },
    { name: "Título profesional", value: 10 },
    { name: "Otros", value: 15 },
  ];

  const statusData = [
    { name: "Aprobado", value: 213, fill: "var(--status-approved)" },
    { name: "En proceso", value: 18, fill: "var(--status-evaluation)" },
    { name: "Observado", value: 10, fill: "var(--status-observed)" },
    { name: "Rechazado", value: 4, fill: "var(--status-rejected)" },
  ];

  const COLORS = ['#8B1E1E', '#D4A017', '#2B2B2B', '#10B981', '#3B82F6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Dashboard Ejecutivo</h1>
        <p className="text-muted-foreground">Jefe de Oficina - Secretaría General</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-l-4 border-l-[var(--unsaac-red)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--unsaac-red)]">Trámites por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="tramites" stroke="var(--unsaac-red)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--unsaac-red)]">Trámites por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Procedure Types */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[var(--unsaac-red)]">Trámites por tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={procedureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} angle={-15} textAnchor="end" height={80} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {procedureData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Users, Shield, BookOpen, Settings, BarChart3, FileText, CreditCard, Building2 } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    { title: "Usuarios registrados", value: "1,245", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Trámites en catálogo", value: "87", icon: BookOpen, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Oficinas activas", value: "24", icon: Building2, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Roles configurados", value: "10", icon: Shield, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const adminModules = [
    { title: "Usuarios", icon: Users, description: "Gestionar usuarios del sistema", link: "/dashboard/admin/users", color: "bg-blue-600" },
    { title: "Roles y permisos", icon: Shield, description: "Configurar permisos de acceso", link: "/dashboard/admin/roles", color: "bg-purple-600" },
    { title: "Catálogo TUPA", icon: BookOpen, description: "Mantener procedimientos", link: "/dashboard/admin/catalogue", color: "bg-[var(--unsaac-red)]" },
    { title: "Requisitos", icon: FileText, description: "Gestionar requisitos", link: "/dashboard/admin/requirements", color: "bg-green-600" },
    { title: "Costos", icon: CreditCard, description: "Administrar costos y pagos", link: "/dashboard/admin/costs", color: "bg-[var(--unsaac-gold)]" },
    { title: "Oficinas", icon: Building2, description: "Configurar oficinas y sedes", link: "/dashboard/admin/offices", color: "bg-indigo-600" },
    { title: "Reportes", icon: BarChart3, description: "Generar reportes y estadísticas", link: "/dashboard/admin/reports", color: "bg-teal-600" },
    { title: "Configuración", icon: Settings, description: "Parámetros del sistema", link: "/dashboard/admin/config", color: "bg-gray-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestión general del sistema TUPA</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-l-4 border-l-[var(--unsaac-red)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--unsaac-red)]">Módulos de administración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.title}
                  to={module.link}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border hover:border-[var(--unsaac-red)] hover:shadow-md transition-all group"
                >
                  <div className={`w-14 h-14 ${module.color} rounded-full flex items-center justify-center`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium mb-1">{module.title}</p>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

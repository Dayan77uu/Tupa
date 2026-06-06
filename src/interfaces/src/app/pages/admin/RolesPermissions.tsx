import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export function RolesPermissions() {
  const roles = [
    { id: 1, name: "Estudiante", users: 850 },
    { id: 2, name: "Egresado", users: 120 },
    { id: 3, name: "Docente", users: 95 },
    { id: 4, name: "Administrativo", users: 45 },
    { id: 5, name: "Mesa de Partes", users: 8 },
    { id: 6, name: "Oficina Responsable", users: 15 },
    { id: 7, name: "Jefe de Oficina", users: 5 },
    { id: 8, name: "Administrador", users: 3 },
  ];

  const permissions = [
    { module: "Trámites", actions: ["Ver", "Crear", "Editar", "Aprobar", "Observar", "Eliminar"] },
    { module: "Documentos", actions: ["Ver", "Subir", "Descargar", "Eliminar"] },
    { module: "Usuarios", actions: ["Ver", "Crear", "Editar", "Eliminar"] },
    { module: "Catálogo TUPA", actions: ["Ver", "Crear", "Editar", "Eliminar", "Exportar"] },
    { module: "Reportes", actions: ["Ver", "Exportar"] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Roles y permisos</h1>
        <p className="text-muted-foreground">Configurar permisos de acceso por rol</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--unsaac-red)]">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-[var(--unsaac-red)] hover:bg-muted transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-sm">{role.name}</p>
                    <p className="text-xs text-muted-foreground">{role.users} usuarios</p>
                  </div>
                  <Badge variant="outline">{role.id}</Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Matrix */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-[var(--unsaac-red)]">Matriz de permisos: Estudiante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Módulo</th>
                    {["Ver", "Crear", "Editar", "Aprobar", "Observar", "Eliminar", "Exportar"].map((action) => (
                      <th key={action} className="text-center p-3 font-medium text-sm">{action}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 font-medium">{perm.module}</td>
                      {["Ver", "Crear", "Editar", "Aprobar", "Observar", "Eliminar", "Exportar"].map((action) => (
                        <td key={action} className="text-center p-3">
                          {perm.actions.includes(action) && (
                            <Checkbox defaultChecked={action === "Ver" && perm.module === "Trámites"} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <Button className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                Guardar permisos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";

export function UserProfile() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Mi perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Datos personales</TabsTrigger>
          <TabsTrigger value="academic">Datos académicos</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--unsaac-red)]">Información personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input id="dni" defaultValue="12345678" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código universitario</Label>
                  <Input id="code" defaultValue="123456" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input id="firstName" defaultValue="Juan Carlos" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input id="lastName" defaultValue="Pérez López" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" defaultValue="juan.perez@unsaac.edu.pe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue="987654321" />
                </div>
              </div>
              <Button className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--unsaac-red)]">Información académica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facultad</Label>
                  <Input defaultValue="Ingeniería" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Escuela profesional</Label>
                  <Input defaultValue="Ingeniería de Sistemas" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Semestre actual</Label>
                  <Input defaultValue="8vo semestre" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Condición</Label>
                  <Input defaultValue="Regular" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--unsaac-red)]">Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                Actualizar contraseña
              </Button>
              <Separator className="my-6" />
              <div>
                <h4 className="font-medium mb-4">Historial de acceso</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span>2026-05-30 09:30 - Navegador Chrome, Windows</span>
                    <span className="text-green-600">Actual</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span>2026-05-29 14:20 - Navegador Chrome, Windows</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--unsaac-red)]">Preferencias de notificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones por correo</p>
                  <p className="text-sm text-muted-foreground">Recibir actualizaciones por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cambios de estado</p>
                  <p className="text-sm text-muted-foreground">Notificar cuando cambie el estado de un trámite</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Observaciones</p>
                  <p className="text-sm text-muted-foreground">Alertar sobre observaciones en documentos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recordatorios de pago</p>
                  <p className="text-sm text-muted-foreground">Recordar pagos pendientes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                Guardar preferencias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

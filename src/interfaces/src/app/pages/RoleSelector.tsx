import { useNavigate } from "react-router";

export function RoleSelector() {
  const navigate = useNavigate();

  const roles = [
    {
      name: "Estudiante",
      path: "/dashboard/student",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Docente",
      path: "/dashboard/teacher",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Egresado",
      path: "/dashboard/graduate",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Administrativo",
      path: "/dashboard/administrative",
      color: "bg-blue-600 hover:bg-blue-700",
    },

    {
      name: "Mesa de Partes",
      path: "/dashboard/mesa-partes",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Oficina",
      path: "/dashboard/office",
      color: "bg-green-600 hover:bg-green-700",
    },

    {
      name: "Jefe de Oficina",
      path: "/dashboard/manager",
      color: "bg-amber-500 hover:bg-amber-600",
    },

    {
      name: "Administrador",
      path: "/dashboard/admin",
      color: "bg-red-700 hover:bg-red-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">

      {/* Logo / título */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-800">
          Sistema TUPA - UNSAAC
        </h1>

        <p className="text-gray-600 mt-2">
          Seleccione el perfil que desea visualizar
        </p>
      </div>

      {/* Botón Login */}
      <button
        onClick={() => navigate("/login")}
        className="mb-8 px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900"
      >
        Ver Página Login
      </button>

      {/* Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl">
        {roles.map((role) => (
          <button
            key={role.path}
            onClick={() => navigate(role.path)}
            className={`
              ${role.color}
              text-white
              rounded-xl
              p-6
              shadow-lg
              transition
              transform
              hover:scale-105
            `}
          >
            <div className="text-xl font-bold">
              {role.name}
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-10 bg-white rounded-xl shadow p-5">
        <h2 className="font-bold mb-3">
          Grupos de actores
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            🔵 Estudiante, Docente, Egresado y Administrativo
          </p>

          <p>
            🟢 Mesa de Partes y Oficina
          </p>

          <p>
            🟡 Jefe de Oficina
          </p>

          <p>
            🔴 Administrador del Sistema
          </p>
        </div>
      </div>
    </div>
  );
}
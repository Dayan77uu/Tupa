// Mapeo explicito de roles reales (ver backend/app/auth/decorators.py) --
// no se inventa ningun rol que no exista en tperfil.
export const ROLES_PERSONAL_ADMINISTRATIVO = [
  "USUARIO DE RECAUDACION",
  "COORDINADOR DE TESORERIA",
  "OPERADOR DE OTI",
];
export const ROL_ADMINISTRADOR = "ADMINISTRADOR";
export const ROLES_GESTION = [...ROLES_PERSONAL_ADMINISTRATIVO, ROL_ADMINISTRADOR];

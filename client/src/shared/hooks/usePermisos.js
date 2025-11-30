import useAuth from './useAuth';

/**
 * usePermisos
 * Gestiona permisos del usuario a partir de sus roles (objetos { id_role, name }).
 * Diseño modular: ROLE_PERMISSIONS puede extenderse fácilmente.
 */
export default function usePermisos() {
  const { user } = useAuth();

  const ROLE_PERMISSIONS = {
    // '*' concede acceso completo
    Admin: ['*'],
    // Tokens de permisos: 'modulo.accion' o comodín 'modulo.*'
    Directivo: ['dashboard.view', 'horarios.view', 'comunicados.*', 'usuarios.*'],
    Jefe_Area: ['dashboard.view', 'inventario.view', 'prestamos.view', 'horarios.*', 'comunicados.view', 'usuarios.view'],
    Profesor: ['dashboard.view', 'horarios.view', 'comunicados.view'],
    Bibliotecario: ['dashboard.view', 'prestamos.*', 'inventario.view', 'comunicados.view'],
    'EMTP Pañol': ['dashboard.view', 'inventario.*', 'prestamos.*', 'comunicados.view'],
    'EMPT Laboratorio': ['dashboard.view', 'inventario.*', 'comunicados.view'],
    'EMTP Server': ['dashboard.view', 'inventario.*', 'prestamos.*', 'comunicados.view'],
  };

  const roleNames = Array.isArray(user?.roles) ? user.roles.map(r => String(r?.name || '')).filter(Boolean) : [];
  const isAdmin = roleNames.includes('Admin');

  // Construimos el conjunto de tokens del usuario (incluye wildcards y permisos específicos)
  const roleTokens = new Set();
  for (const rn of roleNames) {
    const defs = ROLE_PERMISSIONS[rn] || [];
    for (const t of defs) roleTokens.add(String(t));
  }

  // Devuelve comodín por módulo: 'inventario.view' -> 'inventario.*'
  const wildcardForPermission = (normalizedName) => {
    const [mod] = String(normalizedName).split('.');
    return `${mod}.*`;
  };

  /**
   * canAccessTo
   * Verifica si el usuario tiene un permiso específico.
   */
  const canAccessTo = (permissionName) => {
    if (!permissionName) return false;
    if (isAdmin || roleTokens.has('*')) return true;
    if (roleTokens.has(permissionName)) return true;
    const star = wildcardForPermission(permissionName);
    return roleTokens.has(star);
  };

  return {
    canAccessTo,
    permissions: roleTokens,
    roles: Array.isArray(user?.roles) ? user.roles : [],
  };
}

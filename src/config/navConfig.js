// src/config/navConfig.js
export const NAV_ITEMS = [
  { to: "/dashboard", icon: "📊", label: "Dashboard", anyOf: ["dashboard:read"] },

  { to: "/clientes", icon: "👥", label: "Clientes", anyOf: ["clientes:read"] },
  { to: "/mascotas", icon: "🐾", label: "Mascotas", anyOf: ["mascotas:read"] },
  { to: "/turnos", icon: "📅", label: "Turnos", anyOf: ["turnos:read"] },

  { to: "/historial", icon: "📋", label: "Expediente", anyOf: ["historial:read"] },

  { to: "/teleconsultas", icon: "💻", label: "Teleconsultas", anyOf: ["teleconsultas:read"] },

  { to: "/productos", icon: "📦", label: "Inventario", anyOf: ["productos:read"] },

  { to: "/veterinarios", icon: "👨‍⚕️", label: "Usuarios", anyOf: ["veterinarios:read"] },
  { to: "/roles", icon: "⚙️", label: "Roles y permisos", anyOf: ["roles:read"] },
  { to: "/bitacora", icon: "🧾", label: "Bitácora", anyOf: ["bitacora:read"] },

  { to: "/reportes", icon: "📈", label: "Reportes", anyOf: ["reportes:read", "reportes:admin"] },
];
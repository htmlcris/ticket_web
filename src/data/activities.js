/**
 * activities.js — Catálogo de actividades disponibles.
 *
 * Cada actividad otorga 1 ticket al completarse con evidencia fotográfica.
 * Se puede reclamar máximo 1 ticket por actividad por día.
 *
 * Para agregar nuevas actividades, simplemente añade un objeto más al array.
 */

const activities = [
  {
    id: 'exercise',
    name: 'Hacer ejercicio',
    description: 'Demuestra que hiciste ejercicio hoy',
    emoji: '🏋️',
    color: '#34d399',       // emerald-400
    colorLight: '#34d39920', // emerald-400/12
    gradient: 'from-emerald-400 to-teal-400',
  },
  {
    id: 'drawing',
    name: 'Dibujar',
    description: 'Muestra tu obra de arte del día',
    emoji: '🎨',
    color: '#f472b6',       // pink-400
    colorLight: '#f472b620',
    gradient: 'from-pink-400 to-rose-400',
  },
  {
    id: 'skincare',
    name: 'Skincare',
    description: 'Tu rutina de skincare de hoy',
    emoji: '🧴',
    color: '#a78bfa',       // violet-400
    colorLight: '#a78bfa20',
    gradient: 'from-violet-400 to-purple-400',
  },
];

export default activities;

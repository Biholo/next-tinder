const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeStyle: 'short'
});

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit'
});

const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

const parseDate = (date: Date | string | number): Date => {
  if (date instanceof Date) return date;
  if (typeof date === 'number') return new Date(date);
  return new Date(date);
};

export const formatFullDate = (date: Date | string | number): string => {
  try {
    const d = parseDate(date);
    if (!isValidDate(d)) return 'Date invalide';
    return dateFormatter.format(d);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

export const formatMessageDate = (date: Date | string | number): string => {
  try {
    const d = parseDate(date);
    if (!isValidDate(d)) return 'Date invalide';

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Si c'est aujourd'hui
    if (d.toDateString() === now.toDateString()) {
      return timeFormatter.format(d);
    }

    // Si c'est hier
    if (d.toDateString() === yesterday.toDateString()) {
      return `Hier à ${timeFormatter.format(d)}`;
    }

    // Si c'est cette semaine
    if (now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    }

    // Si c'est cette année
    if (d.getFullYear() === now.getFullYear()) {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    }

    // Sinon, date complète
    return dateFormatter.format(d);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

export const formatLastSeen = (date: Date | string | number): string => {
  try {
    const d = parseDate(date);
    if (!isValidDate(d)) return 'Date invalide';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "À l'instant";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }

    return formatFullDate(d);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
}; 
import { google } from "googleapis";
import { auth } from '../../lib/google-api.ts';

async function getUserCalendarEvents(userEmail: string) {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
      const res = await calendar.events.list({
          calendarId: userEmail,
          timeMin: new Date().toISOString(),
          maxResults: 5,
          singleEvents: true,
          orderBy: 'startTime',
      });

      const events = res.data.items;

      if (!events?.length) {
          return `📭 Aucun événement à venir pour ${userEmail}.`;
      }

      return events.map(event => {
          const start = event?.start?.dateTime || event?.start?.date;
          return `📅 ${event.summary} - ${start}`;
      }).join("\n");

  } catch (error) {
      console.error(`Erreur lors de la récupération des événements pour ${userEmail}:`, error);
      return `❌ Impossible de récupérer les événements de ${userEmail}.`;
  }
}

export { getUserCalendarEvents };
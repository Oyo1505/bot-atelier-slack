import { app } from "../../lib/slack-app";

export const fetchUsersList = async (retryCount = 0): Promise<any> => {
  try {
    return await app.client.users.list({
      limit: 117,
      team_id: 'T1WTXHW03',
    });
  } catch (error) {
    if (error instanceof Error && (error as any).data && (error as any).data.retry_after) {
      const retryAfter = (error as any).data.retry_after;
      console.warn(`Rate limit exceeded. Retrying in ${retryAfter} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchUsersList(retryCount + 1);
    } else {
      throw error;
    }
  }
};
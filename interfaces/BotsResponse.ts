import { Bot } from './Bot.ts';

export interface BotsResponse {
  results: Bot[];
  limit: number;
  offset: number;
  count: number;
  total: number;
}

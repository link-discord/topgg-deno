import { Bot } from './Bot.ts';

export interface BotsQuery {
	limit?: number;
	offset?: number;
	search: { [key in keyof Bot]: string } | string;
	sort?: string;
	fields?: string[] | string;
}

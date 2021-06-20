export interface BotWebhook {
	bot: string;
	user: string;
	type: string | 'upvote' | 'test';
	isWeekend: boolean;
	query?: string;
}
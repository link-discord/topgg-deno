export interface WebhookVote {
	bot?: string;
	guild?: string;
	user: string;
	type: string | 'upvote' | 'test';
	isWeekend?: boolean;
	query?:
		| {
				[key: string]: string;
		  }
		| string;
}
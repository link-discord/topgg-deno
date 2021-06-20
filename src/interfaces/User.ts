export interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar?: string;
	defAvatar: string;
	bio?: string;
	banner?: string;
	social: {
		youtube?: string;
		reddit?: string;
		twitter?: string;
		instagram?: string;
		github?: string;
	};
	color?: string;
	supporter: boolean;
	certifiedDev: boolean;
	mod: boolean;
	webMod: boolean;
	admin: boolean;
}

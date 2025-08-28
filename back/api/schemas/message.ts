import zod from 'zod';

const MessageSchema = zod.object({
	name: zod.string().min(2).max(100),
	email: zod.email(),
	message: zod.string().min(10).max(1000),
});

export type Message = zod.infer<typeof MessageSchema>;

export { MessageSchema };

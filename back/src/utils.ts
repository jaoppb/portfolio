import zod from 'zod';
import { MessageSchema, type Message } from './schemas/message.js';

export type ValidationResult<T> =
	| { valid: true; data: T }
	| {
			valid: false;
			errors: zod.core.$ZodIssue[];
	  };

export function validateMessage(data: Message): ValidationResult<Message> {
	try {
		const parsed = MessageSchema.parse(data);
		return { valid: true, data: parsed };
	} catch (e) {
		if (e instanceof zod.ZodError) {
			return { valid: false, errors: e.issues };
		}
		throw e;
	}
}

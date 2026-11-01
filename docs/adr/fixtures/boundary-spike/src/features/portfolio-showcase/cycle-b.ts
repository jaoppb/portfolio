/**
 * Deliberate circular dependency: cycle-b -> cycle-a
 */
import { cycleStepA } from "./cycle-a";

export function cycleStepB(): string {
	return `B -> ${cycleStepA()}`;
}

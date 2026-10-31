/**
 * Deliberate circular dependency: cycle-a -> cycle-b -> cycle-a
 */
import { cycleStepB } from "./cycle-b";

export function cycleStepA(): string {
	return `A -> ${cycleStepB()}`;
}

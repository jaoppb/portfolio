// fallow-ignore-file unused-file
/**
 * Deliberate circular dependency: cycle-a -> cycle-b -> cycle-a
 *
 * Uncomment below to test fallow circular dependency detection:
 */
// import { cycleStepB } from "./cycle-b";
//
// export function cycleStepA(): string {
// 	return `A -> ${cycleStepB()}`;
// }

// fallow-ignore-file unused-file
/**
 * Deliberate circular dependency: cycle-b -> cycle-a
 *
 * Uncomment below to test fallow circular dependency detection:
 */
// import { cycleStepA } from "./cycle-a";
//
// export function cycleStepB(): string {
// 	return `B -> ${cycleStepA()}`;
// }

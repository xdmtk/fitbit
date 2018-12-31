import { createRequest } from "endpoint";
import { me } from "companion";

const MIN_MULTIPLIER = 1000 * 60;
const HOUR_MULTIPLIER = 60;
const WAKEUP_TIMER = 24 * HOUR_MULTIPLIER * MIN_MULTIPLIER;

me.wakeInterval = WAKEUP_TIMER;


function main() {
	const endpoint = createRequest("nick",

	




}

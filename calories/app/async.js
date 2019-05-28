
export async function fireFirstCall(cb, readyState, openState) {
    while (true) {
        if (readyState !== openState) {
            await (function () {
                console.log("waiting for socket to open...");
                return new Promise(resolve => setTimeout(resolve, 2000));
            });
        }
        else {
            cb();
            return;
        }
    }
}

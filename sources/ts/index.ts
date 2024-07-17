import { Mog } from "./mog";
import { LogFn } from "./mog/lib";

(async (): Promise<void> => {
    const mog: Mog = Mog.getSingle();

    mog.init({ parentElement: document.getElementById("main") });

    const log: LogFn = mog.defineLog();

    log(null);
    log(undefined);
    log(NaN);
    log(1_000);
    log("Let it be");
    log(Symbol("^_^"));
    log([1, 2, 3]);
    log({
        Alice: 20,
        Bob: 17,
    });
    log(() => {
        return true;
    });

})();
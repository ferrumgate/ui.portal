import { Subscription } from "rxjs";
/**
 * @summary custom subsribtion for rx/js unsubribes
 * we will not use @ngneat/until-destroy
 * because of decorations
 */
export class SSubscription {
    private _subsriptions: Subscription;
    /**
     *
     */
    constructor() {
        this._subsriptions = new Subscription();

    }
    set addThis(val: Subscription) {
        this._subsriptions.add(val);
    }
    unsubscribe() {
        this._subsriptions.unsubscribe();
    }
}
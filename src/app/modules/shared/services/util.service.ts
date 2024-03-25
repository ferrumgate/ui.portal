import * as moment from 'moment-timezone';
import * as validator from 'validator';
export class UtilService {
    /**
     * creates a random string with 6 length
     */
    static randomNumberString(string_length: number = 16) {

        var chars = "0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ";

        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    }
    static clone<T>(obj: T) {
        return JSON.parse(JSON.stringify(obj)) as T;
    }

    static checkChanged(source?: string[], target?: string[]) {
        if (!target && !source) return false;
        if (!source && target?.length)
            return true;
        if (!target && source?.length)
            return true;
        if (source && target) {
            if (source.length != target.length) return true;
            const founded = source.find(x => !target.includes(x))
            if (founded)
                return true;

        }
        return false;
    }
    static checkUndefinedBoolean(source?: boolean, target?: boolean) {
        return Boolean(source) == Boolean(target) ? false : true;
    }
    static checkUndefinedString(source?: string, target?: string) {
        if (!Boolean(source) && !Boolean(target))
            return false;
        if (!Boolean(source) && Boolean(target))
            return true

        if (Boolean(source) && !Boolean(target))
            return true;
        return source != target;

    }
    static isUndefinedOrNull(val?: any) {
        if (val === undefined) return true;
        if (val === null) return true;
        return false;

    }

    static dateFormatDD(date: Date | number) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let tmp = new Date(date);

        return tmp.getDate().toString() + ` ${days[tmp.getDay()]}`;

    }
    static dateFormatToLocale(date: Date | number) {
        function zeroFill(val: number) {
            if (val < 10) return '0' + val;
            return val;
        }
        const tmp = new Date(date);
        const year = tmp.getFullYear();
        const month = zeroFill(tmp.getMonth() + 1);
        const day = zeroFill(tmp.getDate());

        const hour = zeroFill(tmp.getHours());
        const minute = zeroFill(tmp.getMinutes());
        const second = zeroFill(tmp.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`

    }
    static timeZoneList(): { name: string, offset: number }[] {
        let zones = [];
        const zonenames = moment.tz.names();
        for (const zone of zonenames) {
            const tz = moment.tz.zone(zone);
            if (tz) {
                var z = moment.tz.zone(tz.name);
                if (z)
                    zones.push({ name: tz.name, offset: z?.parse(Date.now()) })

            }

        }
        return zones;

    }

    static isFqdn(fqdn: string) {
        return validator.default.isFQDN(fqdn, { require_tld: false });
    }

}
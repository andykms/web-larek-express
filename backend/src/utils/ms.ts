export function ms(period: string) {
    const last = period[period.length - 1];
    const num = parseInt(period, 10);
    switch (last) {
        case 's':
            return num * 1000;
        case 'm':
            return num * 60 * 1000;
        case 'h':
            return num * 60 * 60 * 1000;
        case 'd':
            return num * 24 * 60 * 60 * 1000;
        case 'w':
            return num * 7 * 24 * 60 * 60 * 1000;
        case 'y':
            return num * 365 * 24 * 60 * 60 * 1000;
        default:
            return num;
    }
}

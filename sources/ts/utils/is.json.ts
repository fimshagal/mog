export const isJson = (input: string): boolean => {
    try {
        JSON.parse(input);
        return true;
    } catch (err) {
        return false;
    }
};
export const isValidEmail = (email: string): boolean => /^\S+@\S+$/.test(email);

export const isValidUsername = (username: string): boolean => /^[0-9A-Za-z]{6,16}$/.test(username);

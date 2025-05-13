import type { User } from './types';

// Ключи для localStorage
const USERS_KEY = 'petsclaws_users';
const CURRENT_USER_KEY = 'petsclaws_current_user';

// Получение списка пользователей
export const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Сохранение списка пользователей
export const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Добавление нового пользователя
export const addUser = (user: Omit<User, 'id'>): User => {
    const users = getUsers();
    const newUser = {
        ...user,
        id: crypto.randomUUID()
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
};

// Получение пользователя по email
export const getUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    return users.find(user => user.email === email);
};

// Сохранение текущего пользователя
export const saveCurrentUser = (user: User): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Получение текущего пользователя
export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

// Удаление текущего пользователя (выход)
export const removeCurrentUser = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

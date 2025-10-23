export type MockUser = {
  loggedIn: boolean;
  name: string;
  email: string;
  phone?: string;
  photo: string;
  password?: string;
  notif?: boolean;
};

export const mockUser: MockUser = {
  loggedIn: true,
  name: 'Julio Mamani',
  email: 'luis.serrano@email.com',
  phone: '71234567',
  photo: 'https://i.pravatar.cc/160?u=luis.serrano@email.com',
  password: 'Demo123!',
  notif: true,
};
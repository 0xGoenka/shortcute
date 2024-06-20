// import { createContext, useContext } from 'react';
// import { KeyboardService } from './keyboard.service';

// const keyboardService = new KeyboardService();

// export const services = {
//   keyboardService,
// };

// export type Services = typeof services;
// export const ServicesContext = createContext<Services | null>(null);
// export const ServicesProvider: React.FC = ({ children }: ) => {
//   return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
// };

// export function useServices(): Services {
//   const services = useContext(ServicesContext);
//   if (!services) {
//     throw Error('ServiceContext not defined');
//   }
//   return services;
// }

import { useContext } from "react";
import { UserContext } from "../../shared/contexts/UserContext";

export default function useUser() {
  const context = useContext(UserContext);
 
  if (!context) {
    throw new Error('El hook useUser debe ser utilizado dentro de un <UserProvider>');
  }

  return context;
}

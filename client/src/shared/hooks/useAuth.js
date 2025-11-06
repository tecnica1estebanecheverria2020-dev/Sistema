import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function useAuth() {
  const context = useContext(UserContext);
 
  if (!context) {
    throw new Error('El hook useUser debe ser utilizado dentro de un <UserProvider>');
  }

  return context;
}

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Snackbar from "../components/Snackbar";

type SnackbarContextType = {
  showSnackbar: (message: string, duration?: number) => void;
  showSuccessSnackbar: (message: string, duration?: number) => void;
  showErrorSnackbar: (message: string, duration?: number) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

type SnackbarProviderProps = {
  children: ReactNode;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarDuration, setSnackbarDuration] = useState(1500); // Default duration
  const [type, setType] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (snackbarVisible) {
      timeout = setTimeout(() => {
        setSnackbarVisible(false);
        setSnackbarMessage("");
      }, snackbarDuration);
    }

    return () => clearTimeout(timeout);
  }, [snackbarVisible, snackbarDuration]);

  const showSnackbar = (
    message: string,
    duration: number = snackbarDuration
  ) => {
    snackbar(message, duration, "");
  };

  const showSuccessSnackbar = (
    message: string,
    duration: number = snackbarDuration
  ) => {
    snackbar(message, duration, "success");
  };

  const showErrorSnackbar = (
    message: string,
    duration: number = snackbarDuration
  ) => {
    snackbar(message, duration, "error");
  };

  const snackbar = (message: string, duration: number, type: string) => {
    setSnackbarMessage(message);
    setSnackbarDuration(duration);
    setType(type);
    setSnackbarVisible(true);
  };
  return (
    <SnackbarContext.Provider
      value={{ showSnackbar, showSuccessSnackbar, showErrorSnackbar }}
    >
      {children}
      {snackbarVisible && (
        <Snackbar
          message={snackbarMessage}
          visible={snackbarVisible}
          type={type}
        />
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

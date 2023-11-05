import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import SwiperModal from "../components/PlayerSwperModal";

type SwiperModalContextType = {
  showSwiperModal: (item: any) => void;
  hideSwiperModal: () => void;
};

const SwiperModalContext = createContext<SwiperModalContextType | undefined>(
  undefined
);

type SwiperModalProviderProps = {
  children: ReactNode;
};

export const SwiperModalProvider: React.FC<SwiperModalProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [item, setItem] = useState(null);

  const showSwiperModal = (item: any) => {
    setItem(item);
    setIsVisible(true);
  };
  const hideSwiperModal = () => {
    setIsVisible(false);
  };

  return (
    <SwiperModalContext.Provider value={{ showSwiperModal, hideSwiperModal }}>
      {children}
      {isVisible && item ? (
        <SwiperModal
          isVisible={isVisible}
          closeModal={hideSwiperModal}
          item={item}
        />
      ) : null}
    </SwiperModalContext.Provider>
  );
};

export const useSwiperModal = () => {
  const context = useContext(SwiperModalContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

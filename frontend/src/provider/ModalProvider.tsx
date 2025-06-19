"use client"
import { createContext, ReactNode, useContext, useState } from "react";

export enum MODAL_TYPE{
    null,
    LOGIN,
    LOGOUT
}

// Define context type
interface ModalContextType {
  isModalOpen: boolean;
  openModal: (modalType:MODAL_TYPE) => void;
  closeModal: () => void;
  modalType:MODAL_TYPE
}

// Create context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Create provider
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[modalType,setModalType]=useState<MODAL_TYPE>(MODAL_TYPE.null)

  // Open modal function
  const openModal = (type:MODAL_TYPE) => {
    setModalType(type)
    setIsModalOpen(true);
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal,modalType }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

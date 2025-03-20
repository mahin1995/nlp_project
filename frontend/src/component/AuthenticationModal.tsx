"use client"
import { useAuth } from "@/app/AuthContextProviders";
import { MODAL_TYPE } from "@/app/ModalProvider";
import { useState, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType:MODAL_TYPE
}

const AuthenticationModal: React.FC<ModalProps> = ({ isOpen, onClose,modalType }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isRegister, setIsRegister] = useState(false);
  let {login,logout}=useAuth()

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Close modal if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (isRegister) {
      console.log("Registering:", { username, email, password });
      login(username)
      onClose()

      // Call API for registration
    } else {
      console.log("Logging in:", { username, password });
      login(username)
      onClose()
      // Call API for login
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 bg-black "
      aria-hidden={!isOpen}
    >
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 dark:bg-gray-700">
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        {modalType==MODAL_TYPE.LOGIN&&(
            <form className="space-y-6" onSubmit={handleSubmit}>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {isRegister ? "Create an account" : "Sign in to our platform"}
          </h3>

          {isRegister && (
           
              <div>
              <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 dark:bg-gray-600 dark:text-white"
                placeholder="name@company.com"
                required
              />
            </div>
          )}

<div>
              <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                Your username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 dark:bg-gray-600 dark:text-white"
                placeholder="Your username"
                required
              />
            </div>

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Your password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 dark:bg-gray-600 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          {!isRegister && (
            <div className="flex justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-900 dark:text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-700 dark:text-blue-500">Lost Password?</a>
            </div>
          )}

          <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2.5 dark:bg-blue-600">
            {isRegister ? "Create Account" : "Login to your account"}
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-300">
            {isRegister ? "Already have an account?" : "Not registered?"}{" "}
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-blue-700 hover:underline dark:text-blue-500">
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>
        </form>
        )}
        {modalType==MODAL_TYPE.LOGOUT &&(
            <>  <p className="text-lg text-gray-500 dark:text-gray-300">
            Are you want to 
            <button type="button" onClick={() =>{
                onClose()
                logout()
            }} className=" pl-2 text-blue-700 hover:underline dark:text-blue-500 cursor-pointer">
              Logout
            </button>
          </p></>
        )}
        
      </div>
    </div>
  );
};

export default AuthenticationModal;

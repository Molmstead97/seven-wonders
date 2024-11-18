import React, { useState, useRef, useEffect } from "react";
import { fadeIn } from './animations/fadeAnimation';

interface AiPlayersModalProps {
  onSubmit: (aiPlayerCount: number) => void;
  onClose: () => void;
}

const AiPlayersModal: React.FC<AiPlayersModalProps> = ({ onSubmit, onClose }) => {
  const [aiPlayersInput, setAiPlayersInput] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      fadeIn(modalRef.current);
    }
  }, []);

  const handleSubmit = () => {
    const aiPlayerCount = Number(aiPlayersInput);

    if (!aiPlayersInput || isNaN(aiPlayerCount) || aiPlayerCount < 2 || aiPlayerCount > 6) {
      alert("Please enter a valid number between 2 and 6");
      return;
    }

    onSubmit(aiPlayerCount);
  };

  return (
    <div ref={modalRef} className="modal-content">
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            How many AI players?
          </h2>
          <div className="mb-6">
            <input
              type="number"
              min="2"
              max="6"
              value={aiPlayersInput}
              onChange={(e) => setAiPlayersInput(e.target.value)}
              className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter a number (2-6)"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WonderChoiceModalProps {
  onChoose: (choice: "choose" | "randomize") => void;
  onClose: () => void;
}

const WonderChoiceModal: React.FC<WonderChoiceModalProps> = ({ onChoose, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      fadeIn(modalRef.current);
    }
  }, []);

  return (
    <div ref={modalRef} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Choose Your Wonder
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Would you like to choose a wonder or have one randomly assigned?
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => onChoose("choose")}
            className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Choose Wonder
          </button>
          <button
            onClick={() => onChoose("randomize")}
            className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Randomize Wonder
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export { AiPlayersModal, WonderChoiceModal };
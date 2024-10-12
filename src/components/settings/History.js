import React, { useState, useEffect, useRef } from "react";
import {
  IoCaretUpCircleOutline,
  IoCaretDownCircleOutline,
} from "react-icons/io5"; // Import icons

const History = ({ subscriberId }) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected history item
  const historyListRef = useRef(null);

  useEffect(() => {
    const fetchHistoryItems = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/history/latest/${subscriberId}`
        );
        const data = await response.json();
        setHistoryItems(data);
      } catch (error) {
        console.error("Error fetching history items:", error);
      }
    };

    fetchHistoryItems();
  }, [subscriberId]);

  useEffect(() => {
    const filtered = historyItems.filter((item) =>
      item.details.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [filterText, historyItems]);

  const scrollUp = () => {
    if (historyListRef.current) {
      historyListRef.current.scrollTop -= 50; // Adjust the value to control the scroll speed
    }
  };

  const scrollDown = () => {
    if (historyListRef.current) {
      historyListRef.current.scrollTop += 50; // Adjust the value to control the scroll speed
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item); // Set the clicked item as the selected item
  };

  return (
    <div className="flex flex-grow ml-36">
      <div>
        <h2 className="text-xl mb-4">Change Audit History</h2>

        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={scrollDown}
            className="bg-transparent border border-black text-black p-2 rounded flex items-center justify-center transition-transform transform active:translate-y-1 active:shadow-inner"
            style={{ width: "45px", height: "45px" }}
          >
            <IoCaretDownCircleOutline style={{ fontSize: "32px" }} />
          </button>
          <button
            onClick={scrollUp}
            className="bg-transparent border border-black text-black p-2 rounded flex items-center justify-center transition-transform transform active:translate-y-1 active:shadow-inner"
            style={{ width: "45px", height: "45px" }}
          >
            <IoCaretUpCircleOutline style={{ fontSize: "32px" }} />
          </button>
          <input
            type="text"
            placeholder="Filter History"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border flex-grow rounded"
          />
        </div>

        <div
          className="history-list overflow-y-auto max-h-64"
          ref={historyListRef}
        >
          {filteredItems.length === 0 ? (
            <p>No history items available.</p>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="mb-2 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <p>
                  {item.date} {item.time} from {item.ip}
                </p>
                <p>{item.details}</p>
                <p className="text-sm text-gray-500">{item.actions}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="w-1/3 p-4 bg-gray-900 border-l border-gray-700">
          <h3 className="text-lg font-bold mb-2">Details</h3>
          <p>
            <strong>Date:</strong> {selectedItem.date}
          </p>
          <p>
            <strong>Time:</strong> {selectedItem.time}
          </p>
          <p>
            <strong>IP:</strong> {selectedItem.ip}
          </p>
          <p>
            <strong>Details:</strong> {selectedItem.details}
          </p>
          <p>
            <strong>Actions:</strong> {selectedItem.actions}
          </p>
        </div>
      )}
    </div>
  );
};

export default History;

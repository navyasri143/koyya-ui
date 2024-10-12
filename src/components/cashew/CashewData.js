import React, { useState } from "react";

const CashewData = () => {
  const [formData, setFormData] = useState({
    date: "",
    boilingSteamingInput: { value: 0, unit: "Kg", overwrite: false },
    boilingSteamingOutput: { value: 0, unit: "Kg", overwrite: false },
    gradingInput: { value: 0, unit: "Kg", overwrite: false },
    gradingOutput: { value: 0, unit: "Kg", overwrite: false },
    cuttingInput: { value: 0, unit: "Kg", overwrite: false }, // Added cutting stage
    cuttingOutput: { value: 0, unit: "Kg", overwrite: false }, // Added cutting stage
    primaryShellingInput: { value: 0, unit: "Kg", overwrite: false },
    primaryShellingOutput: { value: 0, unit: "Kg", overwrite: false },
    secondaryShellingInput: { value: 0, unit: "Kg", overwrite: false },
    secondaryShellingOutput: { value: 0, unit: "Kg", overwrite: false },
    coolingInput: { value: 0, unit: "Kg", overwrite: false }, // Renamed from chilling
    coolingOutput: { value: 0, unit: "Kg", overwrite: false }, // Renamed from chilling
    bormaDryingInput: { value: 0, unit: "Kg", overwrite: false },
    bormaDryingOutput: { value: 0, unit: "Kg", overwrite: false },
    peelingInput: { value: 0, unit: "Kg", overwrite: false },
    peelingOutput: { value: 0, unit: "Kg", overwrite: false },
    sweatingInput: { value: 0, unit: "Kg", overwrite: false },
    sweatingOutput: { value: 0, unit: "Kg", overwrite: false },
    sortingInput: { value: 0, unit: "Kg", overwrite: false },
    sortingOutput: { value: 0, unit: "Kg", overwrite: false },
    packagingInput: { value: 0, unit: "Kg", overwrite: false },
    packagingOutput: { value: 0, unit: "Kg", overwrite: false },
  });

  const [message, setMessage] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setFormData({
      date: "",
      boilingSteamingInput: { value: 0, unit: "Kg", overwrite: false },
      boilingSteamingOutput: { value: 0, unit: "Kg", overwrite: false },
      gradingInput: { value: 0, unit: "Kg", overwrite: false },
      gradingOutput: { value: 0, unit: "Kg", overwrite: false },
      cuttingInput: { value: 0, unit: "Kg", overwrite: false }, // Added cutting stage
      cuttingOutput: { value: 0, unit: "Kg", overwrite: false }, // Added cutting stage
      primaryShellingInput: { value: 0, unit: "Kg", overwrite: false },
      primaryShellingOutput: { value: 0, unit: "Kg", overwrite: false },
      secondaryShellingInput: { value: 0, unit: "Kg", overwrite: false },
      secondaryShellingOutput: { value: 0, unit: "Kg", overwrite: false },
      coolingInput: { value: 0, unit: "Kg", overwrite: false }, // Renamed from chilling
      coolingOutput: { value: 0, unit: "Kg", overwrite: false }, // Renamed from chilling
      bormaDryingInput: { value: 0, unit: "Kg", overwrite: false },
      bormaDryingOutput: { value: 0, unit: "Kg", overwrite: false },
      peelingInput: { value: 0, unit: "Kg", overwrite: false },
      peelingOutput: { value: 0, unit: "Kg", overwrite: false },
      sweatingInput: { value: 0, unit: "Kg", overwrite: false },
      sweatingOutput: { value: 0, unit: "Kg", overwrite: false },
      sortingInput: { value: 0, unit: "Kg", overwrite: false },
      sortingOutput: { value: 0, unit: "Kg", overwrite: false },
      packagingInput: { value: 0, unit: "Kg", overwrite: false },
      packagingOutput: { value: 0, unit: "Kg", overwrite: false },
    });
    setIsSubmitDisabled(true);
    setIsSubmitted(false);
  };

  const fetchDataForDate = (selectedDate) => {
    const sleekId = localStorage.getItem("sleekId");
    const token = localStorage.getItem("token");

    if (!sleekId || !token) {
      setMessage("Sleek ID or token not found. Please log in again.");
      return;
    }

    fetch(
      `http://localhost:8080/api/${sleekId}/processing?date=${selectedDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("No data found for this date");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const processingData = data[0];
          setFormData({
            date: selectedDate,
            boilingSteamingInput: {
              value: processingData.boilingSteamingInput || 0,
              unit: processingData.boilingSteamingInputUnit || "Kg",
              overwrite: processingData.boilingSteamingInputOverwrite || false,
            },
            boilingSteamingOutput: {
              value: processingData.boilingSteamingOutput || 0,
              unit: processingData.boilingSteamingOutputUnit || "Kg",
              overwrite: processingData.boilingSteamingOutputOverwrite || false,
            },
            gradingInput: {
              value: processingData.gradingInput || 0,
              unit: processingData.gradingInputUnit || "Kg",
              overwrite: processingData.gradingInputOverwrite || false,
            },
            gradingOutput: {
              value: processingData.gradingOutput || 0,
              unit: processingData.gradingOutputUnit || "Kg",
              overwrite: processingData.gradingOutputOverwrite || false,
            },
            cuttingInput: {
              value: processingData.cuttingInput || 0, // Added cutting stage
              unit: processingData.cuttingInputUnit || "Kg",
              overwrite: processingData.cuttingInputOverwrite || false,
            },
            cuttingOutput: {
              value: processingData.cuttingOutput || 0, // Added cutting stage
              unit: processingData.cuttingOutputUnit || "Kg",
              overwrite: processingData.cuttingOutputOverwrite || false,
            },
            primaryShellingInput: {
              value: processingData.primaryShellingInput || 0,
              unit: processingData.primaryShellingInputUnit || "Kg",
              overwrite: processingData.primaryShellingInputOverwrite || false,
            },
            primaryShellingOutput: {
              value: processingData.primaryShellingOutput || 0,
              unit: processingData.primaryShellingOutputUnit || "Kg",
              overwrite: processingData.primaryShellingOutputOverwrite || false,
            },
            secondaryShellingInput: {
              value: processingData.secondaryShellingInput || 0,
              unit: processingData.secondaryShellingInputUnit || "Kg",
              overwrite:
                processingData.secondaryShellingInputOverwrite || false,
            },
            secondaryShellingOutput: {
              value: processingData.secondaryShellingOutput || 0,
              unit: processingData.secondaryShellingOutputUnit || "Kg",
              overwrite:
                processingData.secondaryShellingOutputOverwrite || false,
            },
            coolingInput: {
              value: processingData.coolingInput || 0, // Renamed from chilling
              unit: processingData.coolingInputUnit || "Kg",
              overwrite: processingData.coolingInputOverwrite || false,
            },
            coolingOutput: {
              value: processingData.coolingOutput || 0, // Renamed from chilling
              unit: processingData.coolingOutputUnit || "Kg",
              overwrite: processingData.coolingOutputOverwrite || false,
            },
            bormaDryingInput: {
              value: processingData.bormaDryingInput || 0,
              unit: processingData.bormaDryingInputUnit || "Kg",
              overwrite: processingData.bormaDryingInputOverwrite || false,
            },
            bormaDryingOutput: {
              value: processingData.bormaDryingOutput || 0,
              unit: processingData.bormaDryingOutputUnit || "Kg",
              overwrite: processingData.bormaDryingOutputOverwrite || false,
            },
            peelingInput: {
              value: processingData.peelingInput || 0,
              unit: processingData.peelingInputUnit || "Kg",
              overwrite: processingData.peelingInputOverwrite || false,
            },
            peelingOutput: {
              value: processingData.peelingOutput || 0,
              unit: processingData.peelingOutputUnit || "Kg",
              overwrite: processingData.peelingOutputOverwrite || false,
            },
            sweatingInput: {
              value: processingData.sweatingInput || 0,
              unit: processingData.sweatingInputUnit || "Kg",
              overwrite: processingData.sweatingInputOverwrite || false,
            },
            sweatingOutput: {
              value: processingData.sweatingOutput || 0,
              unit: processingData.sweatingOutputUnit || "Kg",
              overwrite: processingData.sweatingOutputOverwrite || false,
            },
            sortingInput: {
              value: processingData.sortingInput || 0,
              unit: processingData.sortingInputUnit || "Kg",
              overwrite: processingData.sortingInputOverwrite || false,
            },
            sortingOutput: {
              value: processingData.sortingOutput || 0,
              unit: processingData.sortingOutputUnit || "Kg",
              overwrite: processingData.sortingOutputOverwrite || false,
            },
            packagingInput: {
              value: processingData.packagingInput || 0,
              unit: processingData.packagingInputUnit || "Kg",
              overwrite: processingData.packagingInputOverwrite || false,
            },
            packagingOutput: {
              value: processingData.packagingOutput || 0,
              unit: processingData.packagingOutputUnit || "Kg",
              overwrite: processingData.packagingOutputOverwrite || false,
            },
          });
          setMessage("Data successfully loaded for the selected date!");
          setIsSubmitted(true);
        } else {
          setMessage("No data found for the selected date.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage(`Error fetching data: ${error.message}`);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sleekId = localStorage.getItem("sleekId");
    const token = localStorage.getItem("token");

    if (!sleekId || !token) {
      setMessage("Sleek ID or token not found. Please log in again.");
      return;
    }

    const flattenedData = flattenFormData(formData);

    if (!formData.date) {
      setMessage("Please select a date before submitting the form.");
      return;
    }

    const isAnyOverwriteChecked = Object.values(formData).some(
      (field) => typeof field === "object" && field.overwrite
    );

    flattenedData.overwrite = isAnyOverwriteChecked;

    fetch(`http://localhost:8080/api/${sleekId}/processing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(flattenedData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setMessage("Data successfully submitted!");
        setIsSubmitted(true);
        resetForm();
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage(`Failed to submit data: ${error.message}`);
      });
  };

  const handleClear = () => {
    resetForm();
    setMessage("");
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    resetForm();
    setFormData((prevState) => ({ ...prevState, date: selectedDate }));

    if (selectedDate) {
      fetchDataForDate(selectedDate);
      setIsSubmitDisabled(false);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        ...(dataset.type === "unit"
          ? { unit: value }
          : { value: parseFloat(value) }),
      },
    }));
  };

  const handleCheckboxChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], overwrite: e.target.checked },
    }));
  };

  const flattenFormData = (data) => {
    return {
      date: data.date,
      boilingSteamingInput: data.boilingSteamingInput.value,
      boilingSteamingInputUnit: data.boilingSteamingInput.unit,
      boilingSteamingOutput: data.boilingSteamingOutput.value,
      boilingSteamingOutputUnit: data.boilingSteamingOutput.unit,
      boilingSteamingInputOverwrite: data.boilingSteamingInput.overwrite,
      boilingSteamingOutputOverwrite: data.boilingSteamingOutput.overwrite,
      gradingInput: data.gradingInput.value,
      gradingInputUnit: data.gradingInput.unit,
      gradingOutput: data.gradingOutput.value,
      gradingOutputUnit: data.gradingOutput.unit,
      gradingInputOverwrite: data.gradingInput.overwrite,
      gradingOutputOverwrite: data.gradingOutput.overwrite,
      cuttingInput: data.cuttingInput.value, // Added cutting stage
      cuttingInputUnit: data.cuttingInput.unit,
      cuttingOutput: data.cuttingOutput.value, // Added cutting stage
      cuttingOutputUnit: data.cuttingOutput.unit,
      cuttingInputOverwrite: data.cuttingInput.overwrite,
      cuttingOutputOverwrite: data.cuttingOutput.overwrite,
      primaryShellingInput: data.primaryShellingInput.value,
      primaryShellingInputUnit: data.primaryShellingInput.unit,
      primaryShellingOutput: data.primaryShellingOutput.value,
      primaryShellingOutputUnit: data.primaryShellingOutput.unit,
      primaryShellingInputOverwrite: data.primaryShellingInput.overwrite,
      primaryShellingOutputOverwrite: data.primaryShellingOutput.overwrite,
      secondaryShellingInput: data.secondaryShellingInput.value,
      secondaryShellingInputUnit: data.secondaryShellingInput.unit,
      secondaryShellingOutput: data.secondaryShellingOutput.value,
      secondaryShellingOutputUnit: data.secondaryShellingOutput.unit,
      secondaryShellingInputOverwrite: data.secondaryShellingInput.overwrite,
      secondaryShellingOutputOverwrite: data.secondaryShellingOutput.overwrite,
      coolingInput: data.coolingInput.value, // Renamed from chilling
      coolingInputUnit: data.coolingInput.unit,
      coolingOutput: data.coolingOutput.value, // Renamed from chilling
      coolingOutputUnit: data.coolingOutput.unit,
      coolingInputOverwrite: data.coolingInput.overwrite,
      coolingOutputOverwrite: data.coolingOutput.overwrite,
      bormaDryingInput: data.bormaDryingInput.value,
      bormaDryingInputUnit: data.bormaDryingInput.unit,
      bormaDryingOutput: data.bormaDryingOutput.value,
      bormaDryingOutputUnit: data.bormaDryingOutput.unit,
      bormaDryingInputOverwrite: data.bormaDryingInput.overwrite,
      bormaDryingOutputOverwrite: data.bormaDryingOutput.overwrite,
      peelingInput: data.peelingInput.value,
      peelingInputUnit: data.peelingInput.unit,
      peelingOutput: data.peelingOutput.value,
      peelingOutputUnit: data.peelingOutput.unit,
      peelingInputOverwrite: data.peelingInput.overwrite,
      peelingOutputOverwrite: data.peelingOutput.overwrite,
      sweatingInput: data.sweatingInput.value,
      sweatingInputUnit: data.sweatingInput.unit,
      sweatingOutput: data.sweatingOutput.value,
      sweatingOutputUnit: data.sweatingOutput.unit,
      sweatingInputOverwrite: data.sweatingInput.overwrite,
      sweatingOutputOverwrite: data.sweatingOutput.overwrite,
      sortingInput: data.sortingInput.value,
      sortingInputUnit: data.sortingInput.unit,
      sortingOutput: data.sortingOutput.value,
      sortingOutputUnit: data.sortingOutput.unit,
      sortingInputOverwrite: data.sortingInput.overwrite,
      sortingOutputOverwrite: data.sortingOutput.overwrite,
      packagingInput: data.packagingInput.value,
      packagingInputUnit: data.packagingInput.unit,
      packagingOutput: data.packagingOutput.value,
      packagingOutputUnit: data.packagingOutput.unit,
      packagingInputOverwrite: data.packagingInput.overwrite,
      packagingOutputOverwrite: data.packagingOutput.overwrite,
    };
  };

  return (
    <div className="flex ml-36 h-screen">
      <form onSubmit={handleSubmit} className="flex-1 p-8 mr-[25%]">
        <h1 className="text-2xl font-bold mb-4">Cashew Nut Processing Data</h1>
        <p className="mb-4">
          The Data item in the menu bar displays a form to input the quantities
          for each of the stages specific to the chosen commodity.
        </p>

        {message && (
          <div className="mb-4 text-green-500 text-sm font-semibold">
            {message}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            max={getMaxDate()}
            className="border rounded w-auto py-2 px-3 text-gray-700"
          />
        </div>

        {[
          {
            label: "Boiling/Steaming",
            inputName: "boilingSteamingInput",
            outputName: "boilingSteamingOutput",
            description:
              "It is where the raw cashew nuts are treated with heat to soften their hard shells. This process involves either boiling the nuts in water or steaming them under controlled pressure, which makes the shell easier to remove without damaging the kernel inside.",
          },
          {
            label: "Grading",
            inputName: "gradingInput",
            outputName: "gradingOutput",
            description:
              "Grading the nuts based on size and quality after boiling or steaming.",
          },
          {
            label: "Cutting", // Added cutting stage
            inputName: "cuttingInput",
            outputName: "cuttingOutput",
            description:
              "The cutting process in cashew processing involves carefully removing the cashew kernel from its shell while minimizing kernel damage.",
          },
          {
            label: "Primary Shelling",
            inputName: "primaryShellingInput",
            outputName: "primaryShellingOutput",
            description:
              "Shelling in cashew nut processing is the step where the outer shell is removed to extract the edible kernel. This process is often done manually or with mechanical devices, carefully splitting the shell without damaging the kernel inside.",
          },
          {
            label: "Secondary Shelling",
            inputName: "secondaryShellingInput",
            outputName: "secondaryShellingOutput",
            description:
              "After primary de-shelling, cashew nuts undergo secondary grading, where they are further sorted based on their quality, size, and appearance. This stage is critical for ensuring that only high-quality kernels are selected for final packaging or further processing, while lower-quality or damaged nuts are separated.",
          },
          {
            label: "Borma Drying",
            inputName: "bormaDryingInput",
            outputName: "bormaDryingOutput",
            description:
              "The Borma dryer is used to reduce the moisture content of the cashew kernels to the desired level, which is crucial for maintaining the quality and shelf life of the nuts. After drying, the nuts are graded again to separate any defective or low-quality kernels.",
          },
          {
            label: "Cooling", // Renamed from chilling
            inputName: "coolingInput",
            outputName: "coolingOutput",
            description:
              "After the nuts are subjected to heat, they are cooled down to make the shells brittle, which aids in easier and cleaner separation of the shell from the kernel. Proper cooling ensures that the nuts do not retain excessive moisture, preventing any damage to the kernels and maintaining their quality for further processing stages.",
          },
          {
            label: "Peeling",
            inputName: "peelingInput",
            outputName: "peelingOutput",
            description:
              "Peeling in cashew nut processing involves the removal of the thin, brown testa or skin that adheres to the kernel after shelling. This process is typically done after the nuts have been dried, which makes the skin brittle and easier to peel off.",
          },
          {
            label: "Sweating",
            inputName: "sweatingInput",
            outputName: "sweatingOutput",
            description:
              "After peeling, the kernels are spread out indoors on cement flooring so that they may absorb some moisture and become less brittle. This prevents the tendency to break easily during grading.",
          },
          {
            label: "Sorting",
            inputName: "sortingInput",
            outputName: "sortingOutput",
            description:
              "The peeled kernels are sorted and graded based on size, colour, and quality. Common grades include W-180, W-210, W-240, W-320, W-450, and various pieces and broken grades.",
          },
          {
            label: "Packaging",
            inputName: "packagingInput",
            outputName: "packagingOutput",
            description:
              "Packaging in cashew nut processing is the final step where processed kernels are packed to ensure their quality, freshness, and safety during storage and transportation.",
          },
        ].map((step, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-lg font-semibold mb-2">{step.label}</h2>
            <p className="mb-2">{step.description}</p>

            <div className="flex flex-col mb-4">
              <div className="flex items-center mb-2">
                <div className="w-32">
                  <label
                    className="block text-gray-700 text-sm font-bold"
                    htmlFor={step.inputName}
                  >
                    Input
                  </label>
                </div>
                <div className="flex items-center flex-1">
                  <input
                    type="number"
                    name={step.inputName}
                    value={formData[step.inputName].value}
                    onChange={handleChange}
                    className="border rounded w-40 py-2 px-4 text-gray-700"
                    disabled={
                      isSubmitted && !formData[step.inputName].overwrite
                    } // Disable if submitted unless overwrite is checked
                  />
                  <select
                    name={step.inputName}
                    data-type="unit"
                    value={formData[step.inputName].unit}
                    onChange={handleChange}
                    className="ml-2 border rounded text-gray-700 py-2 px-4"
                    disabled={
                      isSubmitted && !formData[step.inputName].overwrite
                    } // Disable if submitted unless overwrite is checked
                  >
                    <option value="Kg">Kg</option>
                    <option value="g">g</option>
                  </select>
                  <input
                    type="checkbox"
                    name={`${step.inputName}Overwrite`}
                    checked={formData[step.inputName].overwrite}
                    onChange={(e) => handleCheckboxChange(e, step.inputName)}
                    className="ml-4"
                  />
                  <span className="ml-1">Overwrite</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32">
                  <label
                    className="block text-gray-700 text-sm font-bold"
                    htmlFor={step.outputName}
                  >
                    Output
                  </label>
                </div>
                <div className="flex items-center flex-1">
                  <input
                    type="number"
                    name={step.outputName}
                    value={formData[step.outputName].value}
                    onChange={handleChange}
                    className="border rounded w-40 py-2 px-4 text-gray-700"
                    disabled={
                      isSubmitted && !formData[step.outputName].overwrite
                    } // Disable if submitted unless overwrite is checked
                  />
                  <select
                    name={step.outputName}
                    data-type="unit"
                    value={formData[step.outputName].unit}
                    onChange={handleChange}
                    className="ml-2 border rounded text-gray-700 py-2 px-4"
                    disabled={
                      isSubmitted && !formData[step.outputName].overwrite
                    } // Disable if submitted unless overwrite is checked
                  >
                    <option value="Kg">Kg</option>
                    <option value="g">g</option>
                  </select>
                  <input
                    type="checkbox"
                    name={`${step.outputName}Overwrite`}
                    checked={formData[step.outputName].overwrite}
                    onChange={(e) => handleCheckboxChange(e, step.outputName)}
                    className="ml-4"
                  />
                  <span className="ml-1">Overwrite</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center mt-4">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`${
              isSubmitDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear All
          </button>
        </div>
      </form>

      <div className="fixed right-0 bg-gray-50 w-[15%] h-full p-2 text-sm leading-tight">
        <p className="mb-4">
          <strong>Recording Changes:</strong> A record of the changes is
          automatically saved in the server and viewed on the history page.
        </p>
        <p>
          <strong>Notification via Email:</strong> An email will be sent to the
          subscriber notifying the data input and changes made.
        </p>
        <h2 className="text-xl font-bold mt-4 mb-4 text-black">Overwrite</h2>
        <p>
          <strong>Overwrite option:</strong> Selecting/checking the overwrite
          button will allow you to replace the data in the input and output
          boxes. De-selecting the box will lock the data and cannot be edited.
          The user can overwrite/edit the input or output data anytime even
          after they have submitted by checking the overwrite box.
        </p>
      </div>
    </div>
  );
};

export default CashewData;

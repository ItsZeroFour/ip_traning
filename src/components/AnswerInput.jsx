import React, { useState } from "react";

const AnswerInput = ({ task, onSubmit }) => {
  const [answers, setAnswers] = useState({
    network: "",
    broadcast: "",
    hostCount: "",
  });

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answers);
  };

  const handleReset = () => {
    setAnswers({ network: "", broadcast: "", hostCount: "" });
  };

  if (!task) return null;

  return (
    <div className="answer">
      <h3>Введите ответы:</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="address">Сетевой адрес:</label>
          <input
            type="text"
            id="address"
            value={answers.network}
            onChange={(e) => handleChange("network", e.target.value)}
            placeholder="например, 192.168.1.0"
          />
        </div>

        <div>
          <label htmlFor="address2">Широковещательный адрес:</label>
          <input
            type="text"
            id="address2"
            value={answers.broadcast}
            onChange={(e) => handleChange("broadcast", e.target.value)}
            placeholder="например, 192.168.1.255"
          />
        </div>

        <div>
          <label htmlFor="count">Количество хостов:</label>
          <input
            type="number"
            id="count"
            value={answers.hostCount}
            onChange={(e) => handleChange("hostCount", e.target.value)}
            placeholder="например, 254"
            min="0"
          />
        </div>

        <div>
          <button type="submit">Проверить</button>
          <button type="button" onClick={handleReset}>
            Очистить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerInput;

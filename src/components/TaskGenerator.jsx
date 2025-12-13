import React, { useEffect, useState } from "react";

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Генерация случайного класса A, B или C (без multicast, loopback и т.п.)
const generateRandomIPv4 = () => {
  const first = randomInt(1, 223);
  if (first === 127) return generateRandomIPv4();

  const second = randomInt(0, 255);
  const third = randomInt(0, 255);
  const fourth = randomInt(1, 254);

  return `${first}.${second}.${third}.${fourth}`;
};

// Генерация случайной маски подсети (от /8 до /30, типичные для учебных задач)
const generateRandomMask = () => {
  const prefixLength = randomInt(8, 30);
  const mask = Array(4)
    .fill(0)
    .map((_, i) => {
      if (i * 8 >= prefixLength) return 0;
      if ((i + 1) * 8 <= prefixLength) return 255;
      // частичный октет
      const bits = prefixLength - i * 8;
      return (0xff << (8 - bits)) & 0xff;
    })
    .join(".");
  return mask;
};

const TaskGenerator = ({ onNewTask }) => {
  const [task, setTask] = useState(null);

  const generateTask = () => {
    let ip, mask;
    do {
      ip = generateRandomIPv4();
      mask = generateRandomMask();
    } while (!ip || !mask);

    const newTask = { ip, mask };
    setTask(newTask);
    if (onNewTask) onNewTask(newTask);
  };

  useEffect(() => {
    generateTask();
  }, []);

  if (!task) return <p>Генерация задания...</p>;

  return (
    <div className="task">
      <h3>Текущее задание:</h3>
      <p>
        <strong>IP-адрес:</strong> {task.ip}
        <br />
        <strong>Маска подсети:</strong> {task.mask}
      </p>
      <button onClick={generateTask}>Сгенерировать новое задание</button>
    </div>
  );
};

export default TaskGenerator;

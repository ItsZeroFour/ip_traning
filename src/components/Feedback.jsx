import React from "react";
import ipaddr from "ipaddr.js";

const Feedback = ({ task, userAnswers }) => {
  if (!task?.ip || !task?.mask || !userAnswers) return null;

  let correct = {};
  let errors = {};

  try {
    const ip = ipaddr.parse(task.ip);
    const mask = ipaddr.parse(task.mask);

    if (ip.kind() !== "ipv4" || mask.kind() !== "ipv4") {
      throw new Error("Только IPv4 поддерживается");
    }

    const prefixLen = mask.prefixLengthFromSubnetMask();

    const networkBytes = ip.octets.map((oct, i) => oct & mask.octets[i]);
    const networkStr = networkBytes.join(".");

    const broadcastBytes = networkBytes.map(
      (oct, i) => oct | (~mask.octets[i] & 0xff)
    );
    const broadcastStr = broadcastBytes.join(".");

    const hostCount = Math.pow(2, 32 - prefixLen) - 2;

    correct = {
      network: networkStr,
      broadcast: broadcastStr,
      hostCount: hostCount.toString(),
    };

    errors = {
      network: userAnswers.network.trim() === networkStr,
      broadcast: userAnswers.broadcast.trim() === broadcastStr,
      hostCount: userAnswers.hostCount.toString() === hostCount.toString(),
    };
  } catch (e) {
    console.error("Ошибка расчёта:", e);
    return (
      <div
        style={{
          color: "red",
          padding: "12px",
          backgroundColor: "#ffe6e6",
          borderRadius: "4px",
        }}
      >
        Ошибка при расчёте подсети. Проверьте корректность IP и маски.
        <br />
        <small>{e.message}</small>
      </div>
    );
  }

  return (
    <div className="feedback">
      <h3>Результат проверки:</h3>

      <div>
        <strong>Сетевой адрес:</strong> {errors.network ? "✅" : "❌"}
        {!errors.network && ` Правильно: ${correct.network}`}
        <br />
        <small>Ваш ответ: {userAnswers.network || "—"}</small>
      </div>

      <div>
        <strong>Широковещательный адрес:</strong>{" "}
        {errors.broadcast ? "✅" : "❌"}
        {!errors.broadcast && ` Правильно: ${correct.broadcast}`}
        <br />
        <small>Ваш ответ: {userAnswers.broadcast || "—"}</small>
      </div>

      <div>
        <strong>Количество хостов:</strong> {errors.hostCount ? "✅" : "❌"}
        {!errors.hostCount && ` Правильно: ${correct.hostCount}`}
        <br />
        <small>
          Ваш ответ:{" "}
          {userAnswers.hostCount !== "" ? userAnswers.hostCount : "—"}
        </small>
      </div>

      {!errors.network || !errors.broadcast || !errors.hostCount ? (
        <p>
          Подсказка: сетевой адрес — результат IP AND маска. Broadcast — сетевой
          адрес с единицами в хостовой части.
        </p>
      ) : (
        <p>Отлично! Все ответы верны.</p>
      )}
    </div>
  );
};

export default Feedback;

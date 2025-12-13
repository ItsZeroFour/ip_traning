import React from "react";
import ipaddr from "ipaddr.js";

const SolutionViewer = ({ task }) => {
  if (!task?.ip || !task?.mask) {
    return <div>Нет данных для отображения решения.</div>;
  }

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

    const firstHostBytes = [...networkBytes];
    firstHostBytes[3] += 1;
    const firstHost = firstHostBytes.join(".");

    const lastHostBytes = [...broadcastBytes];
    lastHostBytes[3] -= 1;
    const lastHost = lastHostBytes.join(".");

    const hostCount = Math.pow(2, 32 - prefixLen) - 2;
    const cidr = `/${prefixLen}`;

    return (
      <div className="solution">
        <h3>Полное решение:</h3>
        <p>
          <strong>IP-адрес:</strong> {task.ip}
        </p>
        <p>
          <strong>Маска подсети:</strong> {task.mask} ({cidr})
        </p>
        <p>
          <strong>Сетевой адрес:</strong> {networkStr}
        </p>
        <p>
          <strong>Широковещательный адрес:</strong> {broadcastStr}
        </p>
        <p>
          <strong>Диапазон хостов:</strong> {firstHost} – {lastHost}
        </p>
        <p>
          <strong>Количество доступных хостов:</strong> {hostCount}
        </p>
        <p>
          <strong>Двоичная маска:</strong>{" "}
          {mask.octets.map((o) => o.toString(2).padStart(8, "0")).join(".")}
        </p>
      </div>
    );
  } catch (e) {
    console.error("Ошибка в SolutionViewer:", e);
    return <div>Не удалось отобразить решение: {e.message}</div>;
  }
};

export default SolutionViewer;

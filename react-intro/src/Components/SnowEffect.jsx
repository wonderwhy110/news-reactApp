// src/components/SnowEffect.jsx
import { useEffect } from "react";

function SnowEffect() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .snowflake {
        z-index: 20 !important;

      }
      .snowball-box {
      box-shadow: none !important;
        z-index: 20 !important;
       
      }
        .snowball-box a{
         box-shadow: none !important;
        }


    `;
    document.head.appendChild(style);

    // Путь должен быть: /snowFlakes/snowFlakes/
    const basePath = process.env.PUBLIC_URL || "";
    const snowPath = `${basePath}/snowFlakes/snowFlakes`;

    console.log("Snow path:", snowPath);

    // 1. Загружаем CSS
    const cssUrl = `${snowPath}/snow.min.css`;
    console.log("CSS URL:", cssUrl);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;

    link.onerror = () => console.error("❌ Ошибка CSS");
    document.head.appendChild(link);

    // 2. Загружаем JS
    const jsUrl = `${snowPath}/Snow.js`;
    console.log("JS URL:", jsUrl);

    const script = document.createElement("script");
    script.src = jsUrl;
    script.async = true;

    script.onload = () => {
      console.log("✅ JS загружен");
      console.log("window.Snow:", typeof window.Snow);

      // Ждем немного и запускаем снег
      setTimeout(() => {
        if (window.Snow && typeof window.Snow === "function") {
          try {
            new window.Snow();
          } catch (error) {
            console.error("Ошибка запуска:", error);
          }
        } else {
          console.warn("⚠ window.Snow не функция");
          console.log(
            "Глобальные переменные:",
            Object.keys(window).filter((k) => k.toLowerCase().includes("snow")),
          );
        }
      }, 500);
    };

    script.onerror = () => {
      console.error("❌ Ошибка загрузки JS");
    };

    document.body.appendChild(script);

    return () => {
      // Очистка при размонтировании
      const snowElements = document.querySelectorAll(
        ".snowflake, .snow-container",
      );
      snowElements.forEach((el) => el.remove());
    };
  }, []);

  return null;
}

export default SnowEffect;

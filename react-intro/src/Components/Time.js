  
  
  import { formatDistanceToNow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export const timeAgo = (dateString) => {
    if (!dateString) return "недавно";

    try {
      const date = parseISO(dateString);
      let result =formatDistanceToNow(date, {
        addSuffix: true, // добавляет "назад"
        locale: ru, // русская локализация
        includeSeconds: true,
      });
      if (result.startsWith('около ')){
        result = result.substring(6);
      }
      return result;
    } catch (error) {
      console.error("Error parsing date:", error);
      return "недавно";
    }
  };
import { ITasks } from "@/app/(tabs)/types/task";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Return {
  success: boolean;
  data?: ITasks[] | null;
}

export const saveValue = async (task: ITasks): Promise<Return> => {
  try {
    const tasks = await AsyncStorage.getItem("tasks");
    console.log(tasks);

    if (tasks !== null) {
      const parsedTasks = JSON.parse(tasks);

      if (Array.isArray(parsedTasks)) {
        parsedTasks.push(task);
        await AsyncStorage.setItem("tasks", JSON.stringify(parsedTasks));

        return {
          success: true,
          data: parsedTasks,
        };
      }
    }

    await AsyncStorage.setItem("tasks", JSON.stringify([task]));

    return {
      success: true,
      data: [task],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
    };
  }
};

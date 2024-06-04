import { Text } from "@/components/Themed";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatePresence, MotiView } from "moti";
import { Pressable } from "react-native";
import { ITasks, Status } from "../types/task";

const toggleStatus = async (
  task: ITasks,
  state: React.Dispatch<React.SetStateAction<ITasks[]>>
) => {
  try {
    const tasks = await AsyncStorage.getItem("tasks");

    if (tasks) {
      const json: ITasks[] = JSON.parse(tasks);
      const mapped = json.map((item) => {
        if (item.id === task.id) {
          return {
            ...task,
            status:
              task.status === "PENDING" ? "CONCLUDE" : ("PENDING" as Status),
          };
        } else {
          return item;
        }
      });

      await AsyncStorage.setItem("tasks", JSON.stringify(mapped));
      state(mapped);
    }
  } catch (error) {
    console.log(error);
  }
};

export function TaskItem({
  task,
  state,
}: {
  task: ITasks;
  state: React.Dispatch<React.SetStateAction<ITasks[]>>;
}) {
  return (
    <AnimatePresence>
      <MotiView
        style={{
          marginBottom: 10,
          borderWidth: 1,
          borderColor: "gray",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
        from={{ opacity: 0, translateX: -15 }}
        animate={{ opacity: 1, translateX: 0 }}
        exit={{ opacity: 0, translateX: -10 }}
      >
        <Text style={{ fontSize: 18 }}>{task.task}</Text>
        <Pressable onPress={() => toggleStatus(task, state)}>
          <AntDesign
            name={task.status === "PENDING" ? "clockcircleo" : "checkcircleo"}
            size={22}
            color={task.status === "PENDING" ? "orange" : "green"}
          />
        </Pressable>
      </MotiView>
    </AnimatePresence>
  );
}

import { View, Input, Text } from "@/components/Themed";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, FlatList, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import { saveValue } from "@/storage/save-value";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskItem } from "./components/task";
import { ITasks } from "./types/task";
import { generateRandomString } from "@/utils/random-string";

const formSchema = z.object({
  task: z.string({ required_error: "Uma tarefa é obrigatório" }).min(5, {
    message: "A tarefa deve ter no mínimo 5 caracteres",
  }),
});

export default function TabOneScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  const [tasks, setTasks] = useState<ITasks[]>([]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const newTask: ITasks = {
      id: generateRandomString(),
      task: data.task,
      status: "PENDING",
      date: dayjs(new Date()).format("YYYY-MM-DD"),
    };

    const response = await saveValue(newTask);
    console.log(response);
    setTasks((prev) => [...prev, newTask]);
    reset();
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const json = await AsyncStorage.getItem("tasks");
        if (json) {
          const parsed: ITasks[] = JSON.parse(json);

          setTasks(parsed);
        }
      } catch (error) {
        console.log("Deu erro");
      }
    };

    getTasks();
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
          marginHorizontal: 5,
        }}
      >
        <Controller
          name='task'
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={{ width: "87%", marginRight: 10 }}
              placeholder='Nova tarefa'
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Pressable onPress={handleSubmit(onSubmit)}>
          <View
            style={{
              backgroundColor: "gray",
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <AntDesign name='plus' size={24} color='white' />
          </View>
        </Pressable>
      </View>
      {errors.task && <Text>{errors.task.message}</Text>}
      <FlatList
        style={{
          paddingHorizontal: 5,
        }}
        data={tasks}
        renderItem={({ item }) => <TaskItem state={setTasks} task={item} />}
      />
      <Button
        title='Clear all'
        onPress={async () => {
          try {
            await AsyncStorage.clear();
            setTasks([]);
          } catch (e) {
            console.log(e);
          }
        }}
      />
    </View>
  );
}

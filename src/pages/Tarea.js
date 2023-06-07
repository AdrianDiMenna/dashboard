import React, { useState } from "react";
import { Button, Text, TextInput, View, Pressable, Platform } from "react-native";
import styles from "../utils/styles"
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as  AsyncStorage from '../utils/AsyncStorage';

const Tarea = (props) => {
    const [title, setTitle] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [dateSelected, setDateSelected] = useState('');
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const [type, setType] = useState('');
    const [status, setStatus] = useState('');


    const handeP = () => {
        console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`);
    }
    const handleSubmit = () => {
        let body = {
            title: title,
            descripcion: descripcion,
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`,
            type: type,
            status: status
        }

        AsyncStorage.saveData(body);

    };

    const toggleDatePicker = () => {
        setOpen(!open);
    }

    const onChange = ({ type }, selectedDate) => {
        if (type == 'set') {
            const currentDate = selectedDate;
            setDate(currentDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setDateSelected(currentDate.toDateString());
            }
        } else {
            toggleDatePicker();
        }
    }

    return (
        <View style={styles.container}>
            <Text>Title:</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter a Title"
            />
            <Text>Descripcion:</Text>
            <TextInput
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Enter a descripcion"
            />
            <Text>Date:</Text>

            {!open && (
                <Pressable
                    onPress={toggleDatePicker}
                >
                    <TextInput
                        placeholder="Select Date"
                        value={dateSelected}
                        onChangeText={setDateSelected}
                        editable={false}
                    />
                </Pressable>
            )}

            {open && (
                <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={onChange}
                />
            )}

            <Text>Type:</Text>
            <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
            >
                <Picker.Item label="Select a type" value=""></Picker.Item>
                <Picker.Item label="Task" value="task"></Picker.Item>
                <Picker.Item label="Reminder" value="reminder"></Picker.Item>
                <Picker.Item label="Activity" value="activity"></Picker.Item>
            </Picker>
            <Text>Status:</Text>
            <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
            >
                <Picker.Item label="Select a status" value=""></Picker.Item>
                <Picker.Item label="In Progress" value="in_progress"></Picker.Item>
                <Picker.Item label="Done" value="done"></Picker.Item>
            </Picker>

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );

}

export default Tarea;
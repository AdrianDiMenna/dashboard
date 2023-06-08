import React, { useEffect, useState } from "react";
import { Button, Text, TextInput, View, Pressable, Platform } from "react-native";
import styles from "../utils/styles"
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as  AsyncStorage from '../utils/AsyncStorage';
import { StyleSheet } from "react-native";

const TareaEdit = (props) => {

    const [id, setId] = useState(0)
    const [title, setTitle] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [dateSelected, setDateSelected] = useState('');
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [complete, setComplete] = useState(true);

    useEffect(() => {
        const task = props.route.params.task;

        setType(task.type);
        if (task.type == 'reminder' || task.type == 'activity') {
            setId(task.id);
            setTitle(task.title);
            setDescripcion(task.descripcion);
            setDate(new Date(task.date));
            setDateSelected(task.date);
        } else if (task.type == 'task') {
            setId(task.id);
            setTitle(task.title);
            setDescripcion(task.descripcion);
            setStatus(task.status);
        }
    }, []);

    const handleSubmit = async () => {
        let complete = handleVerify();
        setComplete(complete);
        if (complete) {
            let save;
            if (type == 'task') {
                let body = {
                    id: id,
                    title: title,
                    descripcion: descripcion,
                    type: type,
                    status: status
                }

                save = await AsyncStorage.editTask(props.route.params.task.id, body);
            } else if (type != 'task') {
                let body = {
                    id: id,
                    title: title,
                    descripcion: descripcion,
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`,
                    type: type
                }

                save = await AsyncStorage.editTask(props.route.params.task.id, body);
            }

            if (save) handleButtonClick('EntradaScreen');
        }

    };
    const handleVerify = () => {
        if (type == 'task') {
            if (title == "" || descripcion == "" || status == "") return false;
            else return true;
        } else if (type == 'reminder' || type == 'activity') {
            if (title == '' || descripcion == '' || date == '') return false;
            else return true;
        }
    }
    const handleButtonClick = (goToScreen) => {
        props.navigation.navigate(goToScreen);
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
            <Text style={style.title}>Title:</Text>
            <TextInput
                style={style.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter a Title"
            />
            <Text style={style.title}>Descripcion:</Text>
            <TextInput
                style={style.input}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Enter a descripcion"
            />
            {type != 'task' &&
                <View>
                    <Text style={style.title}>Date:</Text>

                    {!open && (
                        <Pressable
                            onPress={toggleDatePicker}
                        >
                            <TextInput
                                style={style.input}
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
                </View>}

            <Text style={style.title}>Type:</Text>
            <Picker
                style={style.input}
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
            >
                <Picker.Item label="Select a type" value=""></Picker.Item>
                <Picker.Item label="Task" value="task"></Picker.Item>
                <Picker.Item label="Reminder" value="reminder"></Picker.Item>
                <Picker.Item label="Activity" value="activity"></Picker.Item>
            </Picker>
            {type == 'task' &&
                <View>
                    <Text style={style.title}>Status:</Text>
                    <Picker
                        style={style.input}
                        selectedValue={status}
                        onValueChange={(itemValue) => setStatus(itemValue)}
                    >
                        <Picker.Item label="Select a status" value=""></Picker.Item>
                        <Picker.Item label="In Progress" value="in_progress"></Picker.Item>
                        <Picker.Item label="Done" value="done"></Picker.Item>
                    </Picker>
                </View>
            }

            <View style={style.boton}>
                <Button title="Submit" onPress={handleSubmit} />
            </View>

            {!complete && (
                <View>
                    <Text style={style.incomplete}>*Debe completar todos los campos!</Text>
                </View>
            )}
        </View>
    );
}


const style = StyleSheet.create({
    input: {
        height: 50,
        fontSize: 18
    },
    title: {
        height: 30,
        fontSize: 16
    },
    incomplete: {
        color: 'red',
        alignContent: 'center'
    },
    boton: {
        marginTop: 10
    }
});

export default TareaEdit;
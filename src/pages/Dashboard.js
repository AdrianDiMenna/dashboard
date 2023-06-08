import React, { useState, useEffect } from "react";
import { Button, Text, View, ScrollView, Pressable, Platform, TextInput } from "react-native";
import styles from "../utils/styles";
import { DataTable } from 'react-native-paper';
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as  AsyncStorageTask from '../utils/AsyncStorage';
import DateTimePicker from '@react-native-community/datetimepicker';

const Dashboard = () => {
    const [taskWeek, setTaskWeek] = useState([]);
    const [taskPending, setTaskPending] = useState([]);
    const [taskSearch, setTaskSearch] = useState([]);
    const [data, setData] = useState([]);
    const [exists, setExistsData] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dateSelected, setDateSelected] = useState('');
    const [open, setOpen] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const datas = await AsyncStorage.getItem('task');

                    if (datas) {
                        const parsedData = JSON.parse(datas);
                        setData(parsedData);
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            fetchData();

        }, [])
    );

    useEffect(() => {
        if (data && data.length > 0) {

            let weekTask = [];
            let taskProgress = [];
            const dateDay = new Date();
            let sevenDays = `${dateDay.getFullYear()}-${dateDay.getMonth() + 1}-${dateDay.getDate() + 7} ${dateDay.getHours()}:${dateDay.getMinutes()}:${dateDay.getSeconds()}.${dateDay.getMilliseconds()}`;
            const timeSevenDays = new Date(sevenDays);

            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element.type != 'task') {
                    var time = new Date(element.date);
                    if (time < timeSevenDays) {
                        weekTask.push(element);
                    }
                } else {
                    if (element.status != "done") {
                        taskProgress.push(element);
                    }
                }
            }
            setTaskWeek(weekTask);
            setTaskPending(taskProgress);
            setExistsData(true);
        }
    }, [data]);

    const handleSearchTask = () => {
        let datePick = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
        let timePick = new Date(datePick);
        let task = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.type != 'task') {
                const time = new Date(element.date);
                if (timePick.getDate() == time.getDate() && timePick.getMonth() == time.getMonth()
                    && timePick.getFullYear() == time.getFullYear()) {
                    task.push(element);
                }
            }
        }

        setTaskSearch(task);
    }

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

    const handleOnCheck = (id) => {
        AsyncStorageTask.checkTypeStorage(id);
        setTaskPending(taskPending.filter((item) => item.id != id));
    }

    return (
        <ScrollView >
            <View style={style.container}>

                {exists && (
                    <View style={style.card}>
                        <Text style={style.title}>Proximos 7 dias</Text>
                        <DataTable style={style.table}>
                            <DataTable.Header style={style.tableHeader}>
                                <DataTable.Title>Titulo</DataTable.Title>
                                <DataTable.Title>Descripcion</DataTable.Title>
                                <DataTable.Title>Fecha</DataTable.Title>
                                <DataTable.Title>Tipo</DataTable.Title>
                            </DataTable.Header>
                            {taskWeek.map((item) => {
                                return (
                                    <DataTable.Row key={item.id} style={style.tableColumns}>
                                        <DataTable.Cell>{item.title}</DataTable.Cell>
                                        <DataTable.Cell>{item.descripcion}</DataTable.Cell>
                                        <DataTable.Cell>{item.date}</DataTable.Cell>
                                        <DataTable.Cell>{item.type}</DataTable.Cell>
                                    </DataTable.Row>
                                );
                            })}
                        </DataTable>
                    </View>
                )}

                {exists && (
                    <View style={style.card}>
                        <Text style={style.title}>Tareas Pendientes</Text>
                        <DataTable style={style.table}>
                            <DataTable.Header style={style.tableHeader}>
                                <DataTable.Title>Titulo</DataTable.Title>
                                <DataTable.Title>Descripcion</DataTable.Title>
                                <DataTable.Title>Tipo</DataTable.Title>
                                <DataTable.Title>Estado</DataTable.Title>
                                <DataTable.Title></DataTable.Title>
                            </DataTable.Header>
                            {taskPending.map((item) => {
                                return (
                                    <DataTable.Row key={item.id} style={style.tableColumns}>
                                        <DataTable.Cell>{item.title}</DataTable.Cell>
                                        <DataTable.Cell>{item.descripcion}</DataTable.Cell>
                                        <DataTable.Cell>{item.type}</DataTable.Cell>
                                        <DataTable.Cell>{item.status}</DataTable.Cell>
                                        <DataTable.Cell >
                                            <Pressable style={style.botomDone}>
                                                <Text onPress={() => handleOnCheck(item.id)}>Done</Text>
                                            </Pressable>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                );
                            })}
                        </DataTable>
                    </View>
                )}

                {exists && (
                    <View style={style.card}>
                        <Text style={style.title}>Actividades</Text>
                        <View style={style.searchDate}>
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

                            <Button
                                title="Buscar"
                                onPress={() => handleSearchTask()}
                            />

                            {open && (
                                <DateTimePicker
                                    mode="date"
                                    display="spinner"
                                    value={date}
                                    onChange={onChange}
                                />
                            )}
                        </View>
                        <DataTable style={style.table}>
                            <DataTable.Header style={style.tableHeader}>
                                <DataTable.Title>Titulo</DataTable.Title>
                                <DataTable.Title>Descripcion</DataTable.Title>
                                <DataTable.Title>Fecha</DataTable.Title>
                                <DataTable.Title>Tipo</DataTable.Title>
                            </DataTable.Header>
                            {taskSearch.map((item) => {
                                return (
                                    <DataTable.Row key={item.id} style={style.tableColumns}>
                                        <DataTable.Cell>{item.title}</DataTable.Cell>
                                        <DataTable.Cell>{item.descripcion}</DataTable.Cell>
                                        <DataTable.Cell>{item.date}</DataTable.Cell>
                                        <DataTable.Cell>{item.type}</DataTable.Cell>
                                    </DataTable.Row>
                                );
                            })}
                        </DataTable>
                    </View>
                )
                }
            </View>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    card: {
        backgroundColor: '#FFEAD2',
        borderWidth: 5,
        justifyContent: "center",
        marginBottom: 10
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#8294C4',
        padding: 20,
        margin: 0,
    },
    title: {
        textAlign: 'center',
        position: 'relative',
        top: 1,
        fontSize: 18,
        fontStyle: 'italic'
    },
    table: {
        padding: 20
    },
    tableHeader: {
        backgroundColor: '#DCDCDC'
    },
    tableColumns: {
        backgroundColor: '#FFF'
    },
    botomDone: {
        backgroundColor: "#46C2CB",
        padding: 10
    },
    searchDate: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    }
});

export default Dashboard;
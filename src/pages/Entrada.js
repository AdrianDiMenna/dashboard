import React, { useEffect, useState } from "react";
import { Button, Text, View, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ScrollView } from "react-native";
import stylesU from "../utils/styles";
import * as  AsyncStorageTask from '../utils/AsyncStorage';
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';




const Entrada = (props) => {

    const [data, setData] = useState([]);
    const [existsData, setExistsData] = useState(false);



    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const datas = await AsyncStorage.getItem('task');

                    if (datas) {
                        setData(JSON.parse(datas));
                        setExistsData(true);
                    } else {
                        setExistsData(false);
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            fetchData();

        }, [])
    );

    const handleButtonClick = (goToScreen) => {
        props.navigation.navigate(goToScreen);
    };

    const handleOnDelete = (id) => {
        AsyncStorageTask.deleteById(id);
        setData(data.filter((item) => item.id != id));
    }

    const handleEdit = async (id) => {
        let task = await AsyncStorageTask.getTaskId(id);

        if (task) props.navigation.navigate('TareaEdit', {
            task
        });
    }

    return (
        <ScrollView style={stylesU.container}>
            <Button
                title="Agregar nuevo"
                onPress={() => handleButtonClick("TareaScreen")}
            />

            <View>
                {existsData ? (

                    <View style={styles.scrollView}>
                        {data.map((item) => {
                            return (
                                <View key={item.id} style={[styles.table]}>
                                    <View>
                                        <View style={styles.section}>
                                            <Text > Titulo: </Text>
                                            <Text style={styles.td}>{item.title}</Text>
                                        </View>
                                        <View style={styles.section}>
                                            <Text> Descripcion: </Text>
                                            <Text style={styles.td}>{item.descripcion}</Text>
                                        </View>
                                        {item.date
                                            ?
                                            <View style={styles.section}>
                                                <Text> Fecha: </Text>
                                                <Text style={styles.td}>{item.date}</Text>
                                            </View>
                                            : <View></View>}
                                        <View style={styles.section}>
                                            <Text> Tipo: </Text>
                                            <Text style={styles.td}>{item.type}</Text>
                                        </View>
                                        {item.status
                                            ?
                                            <View style={styles.section}>
                                                <Text> Estado: </Text>
                                                <Text style={styles.td}>{item.status}</Text>
                                            </View>
                                            : <View></View>}
                                    </View>
                                    <View style={styles.botonGroup}>
                                        <Button
                                            color="#FF0060"
                                            width="50"
                                            title="X"
                                            onPress={() => { handleOnDelete(item.id) }}
                                        />
                                    </View>
                                    <View style={styles.botonGroup}>

                                        <Button
                                            color="#F79327"
                                            title="Edit"
                                            onPress={() => { handleEdit(item.id) }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>

                ) : (
                    <Text>Not Task!</Text>
                )}
            </View>
        </ScrollView>


    );
}

const styles = StyleSheet.create({
    section: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "left",
        textAlignVertical: "center",
        margin: 5
    },
    scrollView: {
        marginBottom: 40,
    },
    table: {
        padding: 20,
        backgroundColor: "#FFEAD2",
        margin: 10,
        borderRadius: 10
    },
    column: {
        justifyContent: "center"
    },
    botonGroup: {
        margin: 5
    }

});

export default Entrada;
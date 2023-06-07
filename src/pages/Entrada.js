import React, { useEffect, useState } from "react";
import { Button, Text, View, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from "react-native";
import stylesU from "../utils/styles";
import * as  AsyncStorageTask from '../utils/AsyncStorage';
import { CommonActions, useFocusEffect } from "@react-navigation/native";
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
            console.log(data);

        }, [])
    );


    const handleP = () => {
        // AsyncStorage.deleteStorage();
        console.log(data);
    }


    const handleButtonClick = (goToScreen) => {
        props.navigation.navigate(goToScreen);
    };

    const handleOnDelete = (id) => {
        AsyncStorageTask.deleteById(id);
    }

    const TableItem = ({ item, onDelete }) => {
        return (
            <View style={styles.items}>
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.descripcion}</Text>
                    <Text>{item.date}</Text>
                    <Text>{item.type}</Text>
                    <Text>{item.status}</Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                    <Text style={styles.botomItem}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        )

    };


    return (
        <View style={stylesU.container}>
            <Button
                title="Agregar nuevo"
                onPress={() => handleButtonClick("Tarea")}
            />
            <Button
                title="log"
                onPress={() => handleP()}
            />
            <View>
                {existsData ? (
                    <View style={styles.container}>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => <TableItem item={item} onDelete={handleOnDelete} />}
                            keyExtractor={item => item.id}
                        />
                    </View>
                ) : (
                    <Text>Not Task!</Text>
                )}
            </View>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        flexDirection: "row"
    },
    items: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flex: 1,
        flexDirection: "row"
    },
    title: {
        fontSize: 22,
    },
    botomItem: {
        justifyContent: "center"
    }
});

export default Entrada;
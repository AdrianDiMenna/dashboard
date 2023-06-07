import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (task) => {
    try {
        let tasks = await AsyncStorage.getItem('task') || false;
        task.id = generateId(tasks);
        if (tasks != false) {
            const existingTask = JSON.parse(tasks);
            const newData = [...existingTask, task];
            await AsyncStorage.setItem('task', JSON.stringify(newData));
            console.log('Added Data Task!!');
        } else {
            let arr = [];
            arr.push(task);
            await AsyncStorage.setItem('task', JSON.stringify(arr));
            console.log('Data saved!!');
        }

    } catch (error) {
        console.log('Error savign data', error);
    }
}

export const getData = async () => {
    try {
        let tasks = await AsyncStorage.getItem('task') || false;
        if (tasks != false) {
            return JSON.parse(tasks);
        } else {
            return [];
        }
    } catch (error) {
        console.log('Error retrieving data: ', error);
    }
}


export const generateId = (tasks) => {
    try {
        if (tasks != false) {
            let id = 0;
            let isExists = false;
            let value = JSON.parse(tasks);
            while (isExists == false) {
                const isDuplicateId = value.some((item) => item.id == id)
                if (isDuplicateId) id = id + 1;
                else isExists = true;
            }
            return id;
        } else {
            return 0;
        }
    } catch (error) {
        console.log('Error retrieving data: ', error);
    }
}

export const deleteById = async (id) => {
    try {
        let tasks = await AsyncStorage.getItem('task') || false;

        if (tasks != false) {
            let value = JSON.parse(tasks);
            let place = value.findIndex((item) => item.id == id);
            if(place != -1) value.splice(place, 1);
            await AsyncStorage.setItem('task',JSON.stringify(value));
        } else {
            console.log('Not Tasks for delete...');
        }
    } catch (error) {
        console.log('Error retrieving data: ', error);
    }
}

export const deleteStorage = async () =>{
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log('Error retrieving data: ', error);
    }
}

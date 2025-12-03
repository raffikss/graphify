    import React, { useState } from 'react';
    import { View, Text, Button, Image, StyleSheet, Alert, Platform } from 'react-native';
    import * as ImagePicker from 'expo-image-picker';
    import { useRouter } from 'expo-router';

    export default function TeacherCreate() {
    const [imageUri, setImageUri] = useState(null);
    const router = useRouter();

    async function pickImage() {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Camera permission required');

        const res = await ImagePicker.launchCameraAsync({ 
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8 
        });
        if (!res.canceled && res.assets?.length > 0) {
        setImageUri(res.assets[0].uri);
        }
    }

    async function pickFile() {
        // Request media library permissions for file selection
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') return Alert.alert('Media library permission required');
        }

        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });
        
        if (!res.canceled && res.assets?.length > 0) {
            setImageUri(res.assets[0].uri);
        }
    }

    function goToAnnotate() {
        if (!imageUri) return Alert.alert('Please select an image first');
        router.push({ pathname: '/teacher-annotate', params: { imageUri } });
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Teacher — Create Exercise</Text>
        <View style={styles.preview}>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <Text>No image yet</Text>}
        </View>
        <Button title="Take Photo" onPress={pickImage} />
        <Button title="Choose from Gallery" onPress={pickFile} />
        <Button title="Annotate & Save" onPress={goToAnnotate} />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 12 },
    preview: { width: '100%', height: 380, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    image: { width: '100%', height: '100%', resizeMode: 'contain' },
    });

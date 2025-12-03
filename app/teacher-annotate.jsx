import React, { useState } from "react";
import { View, Text, Image, Button, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { uploadFileToStorage } from "../utils/appwrite";
import * as ImagePicker from 'expo-image-picker'; 

export default function TeacherAnnotate() {
    const { imageUri } = useLocalSearchParams();
    const router = useRouter();
    const [points, setPoints] = useState([]);
    const [imageLayout, setImageLayout] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const [aspectRatio, setAspectRatio] = useState(1); 

    React.useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (width, height) => {
                setAspectRatio(width / height);
            }, (error) => console.error("Couldn't get image size", error));
        }
    }, [imageUri]);

    function handleTap(e) {
        if (!imageLayout) return;
        const { locationX, locationY } = e.nativeEvent;
        
        const normalizedX = locationX / imageLayout.width;
        const normalizedY = locationY / imageLayout.height;
        
        setPoints(prev => [...prev, { x: normalizedX, y: normalizedY }]);
    }

    async function handleSave() {
        if(points.length === 0) return Alert.alert("Add some red dots first!");
        
        setIsUploading(true);
        try {
            console.log("Starting upload process...");
            const originalUpload = await uploadFileToStorage(imageUri, `exercise-orig-${Date.now()}.jpg`);
            console.log("Upload successful:", originalUpload);

            router.push({
                pathname: "/student-solve",
                params: {
                    teacherOriginalUrl: originalUpload.url,
                    redPoints: JSON.stringify(points)
                }
            });
        } catch (err) {
            console.error("Save failed:", err);
            Alert.alert("Save failed", `Error: ${err.message || 'Unknown error occurred'}`);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Annotate</Text>

            <View style={[styles.dynamicContainer, { aspectRatio: aspectRatio }]}>
                <View
                    style={styles.imageWrapper}
                    onLayout={e => setImageLayout(e.nativeEvent.layout)}
                >
                    <Pressable style={{ flex: 1 }} onPress={handleTap}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                        />
                        {imageLayout && points.map((p, i) => (
                            <View
                                key={i}
                                style={{
                                    position: "absolute",
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: "red",
                                    left: (p.x * imageLayout.width) - 10,
                                    top: (p.y * imageLayout.height) - 10,
                                }}
                            />
                        ))}
                    </Pressable>
                </View>
            </View>

            <View style={styles.controls}>
                <Button title="Undo" onPress={() => setPoints(p => p.slice(0, -1))} />
                <Button title="Clear" onPress={() => setPoints([])} />
                {isUploading ? <ActivityIndicator /> : <Button title="Save & Test" onPress={handleSave} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, alignItems: 'center' },
    title: { fontSize: 20, marginBottom: 12 },
    dynamicContainer: {
        width: '100%', 
        maxHeight: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee', 
        marginBottom: 12,
    },
    imageWrapper: {
        width: "100%",
        height: "100%",
    },
    image: { width: "100%", height: "100%", resizeMode: "stretch" }, 
    controls: { flexDirection: "row", width: '100%', justifyContent: "space-around" },
});
// app/result.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router'; 

export default function Result() {
    const params = useLocalSearchParams(); 
    const score = params.score || '0';
    const total = params.total || '0';
    const teacherMarkedUrl = params.teacherMarkedUrl;
    const studentMarkedUrl = params.studentMarkedUrl;
    const redPoints = params.redPoints ? JSON.parse(params.redPoints) : [];

    const [teacherLayout, setTeacherLayout] = useState(null);
    const [teacherAspectRatio, setTeacherAspectRatio] = useState(1);

    useEffect(() => {
        if (teacherMarkedUrl) {
            Image.getSize(teacherMarkedUrl, (w, h) => {
                setTeacherAspectRatio(w / h);
            }, (e) => console.error(e));
        }
    }, [teacherMarkedUrl]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Result</Text>
            <Text style={styles.score}>{`Score: ${score} / ${total}`}</Text>

            <Text style={styles.sectionTitle}>Teacher's Answer</Text>
            <View style={[styles.imageWrapper, { aspectRatio: teacherAspectRatio }]}>
                <View 
                    style={styles.overlayContainer}
                    onLayout={(e) => setTeacherLayout(e.nativeEvent.layout)}
                >
                    {teacherMarkedUrl && (
                        <Image 
                            source={{ uri: teacherMarkedUrl }} 
                            style={styles.image} 
                            resizeMode="contain" 
                        />
                    )}
                    {teacherLayout && redPoints.map((p, i) => (
                        <View
                            key={i}
                            style={{
                                position: 'absolute',
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: 'red',
                                borderWidth: 2,
                                borderColor: 'white',
                                left: (p.x * teacherLayout.width) - 12,
                                top: (p.y * teacherLayout.height) - 12,
                            }}
                        />
                    ))}
                </View>
            </View>

            <Text style={styles.sectionTitle}>Your Submission</Text>
            <View style={[styles.imageWrapper, { aspectRatio: teacherAspectRatio }]}>
                {studentMarkedUrl ? (
                    <Image 
                        source={{ uri: studentMarkedUrl }} 
                        style={styles.image} 
                        resizeMode="contain" 
                    />
                ) : <Text>No student image</Text>}
            </View>

            <View style={styles.buttonWrapper}>
                <Link href="/" asChild>
                    <Button title="Back to Home" />
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    score: { fontSize: 20, color: 'darkgreen', marginBottom: 20 },
    sectionTitle: { marginTop: 20, fontSize: 16, fontWeight: '600', marginBottom: 8 },
    imageWrapper: {
        width: '100%',
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    overlayContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    image: { width: '100%', height: '100%' },
    buttonWrapper: { marginTop: 30, width: '100%', paddingBottom: 40 },
});
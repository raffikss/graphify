import React, { useState, useEffect, forwardRef } from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const ImageAnnotator = forwardRef(({ imageUri, points = [], markerColor = 'red', onPointsChange }, ref) => {
    const [layout, setLayout] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(1);

    useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (width, height) => {
                setAspectRatio(width / height);
            }, (err) => console.log("Size Error:", err));
        }
    }, [imageUri]);

    function handlePress(evt) {
        if (!layout) return;
        const { locationX, locationY } = evt.nativeEvent;
        const nx = locationX / layout.width;
        const ny = locationY / layout.height;
        if (onPointsChange) onPointsChange([...points, { x: nx, y: ny }]);
    }

    return (
        <View style={styles.container}>
            {}
            <View 
                ref={ref} 
                collapsable={false} 
                style={[styles.aspectContainer, { aspectRatio: aspectRatio }]}
            >
                <TouchableWithoutFeedback onPress={handlePress}>
                    <View 
                        style={styles.touchableArea}
                        onLayout={(e) => setLayout(e.nativeEvent.layout)}
                    >
                        <Image 
                            source={{ uri: imageUri }} 
                            style={styles.image} 
                            resizeMode="contain" 
                        />
                        
                        {layout && points.map((p, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.marker,
                                    {
                                        left: (p.x * layout.width) - 14,
                                        top: (p.y * layout.height) - 14,
                                        backgroundColor: markerColor,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
});

export default ImageAnnotator;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        height: '100%',
        backgroundColor: '#333', 
    },
    aspectContainer: {
        width: '100%', 
        height: undefined, 
        maxHeight: '100%', 
        backgroundColor: 'transparent',
    },
    touchableArea: {
        width: '100%',
        height: '100%',
    },
    image: { 
        width: '100%', 
        height: '100%', 
    },
    marker: { 
        position: 'absolute', 
        width: 28, 
        height: 28, 
        borderRadius: 14, 
        borderWidth: 3, 
        borderColor: 'white' 
    },
});
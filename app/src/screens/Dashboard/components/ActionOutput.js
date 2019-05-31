import React from 'react';
import { Colors } from '../../../styles';
import {
    Image,
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

function ActionOutput({ doorIsClosed, windowIsClosed }) {
    if (doorIsClosed === null || windowIsClosed === null) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.itemWithDivider}>
                <Text style={styles.heading}>Window</Text>
                <View style={styles.imageContainer}>
                    {windowIsClosed 
                        ? <Image source={require('../../../assets/window-closed.png')} style={styles.image} />
                        : <Image source={require('../../../assets/window-open.png')} style={styles.image} />
                    }
                </View>
            </View>
            <View style={styles.item}>
                <Text style={styles.heading}>Door</Text>
                <View style={styles.imageContainer}>
                    {doorIsClosed 
                        ? <Image source={require('../../../assets/door-closed.png')} style={styles.image} />
                        : <Image source={require('../../../assets/door-open.png')} style={styles.image} />
                    }                
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexGrow: 1,
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        marginBottom: 20,
    },
    item: {
        padding: 20,
        flex: 1,
        height: '100%',
    },
    image: {
        height: 125,
        width: 100,
        margin: 25,
        resizeMode: 'contain'
    },
    imageContainer: {
        alignItems: 'center',
    },
    itemWithDivider: {
        borderRightWidth: 1,
        borderRightColor: Colors.grey.light,
        padding: 20,
        flex: 1,
        height: '100%',
    },
});

export default ActionOutput;
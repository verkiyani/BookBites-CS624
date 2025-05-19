import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [myList, setMyList] = useState([]);
    const [showMyList, setShowMyList] = useState(false);
    const [addedMessage, setAddedMessage] = useState('');

    const bookExamples = [
        {id: 1, title: '1984', author: 'George Orwell', image: require('../assets/images/1984.jpg') }, 
        {id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', image: require('../assets/images/greatgatsby.jpg')},
        {id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', image: require('../assets/images/tokillamockingbird.png')},
    ]; 

    const addToList = (book) => {
        if (!myList.some(item => item.id === book.id)) {
            setMyList([...myList, book]);
            setAddedMessage(`"${book.title}" has been added to your list.`);
            setTimeout(() => setAddedMessage(''), 1500);
        }
    };

    return (
        <View style={styles.container}>
            {/* Nav button at the top */}
            <TouchableOpacity
                style={styles.myListButton}
                onPress={() => setShowMyList(!showMyList)}
            >
                <Text style={styles.myListButtonText}>
                    {showMyList ? 'Back to Home' : 'My List'}
                </Text>
            </TouchableOpacity>

            {/* Show message when a book is added */}
            {addedMessage !== '' && (
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>{addedMessage}</Text>
                </View>
            )}

            <Image
                source={require('../assets/images/books.jpg')}
                style={styles.bannerImage}
            />
            <Text style={styles.header}>Welcome to BookBites</Text>
            <Text style={styles.subheader}>Discover and share the books you love.</Text>

            <Text style={styles.sectionTitle}>
                {showMyList ? 'My List' : 'Popular Now'}
            </Text>

            <ScrollView style={styles.bookList}>
                {(showMyList ? myList : bookExamples).map(book => (
                    <View key={book.id} style={styles.bookItem}>
                        <Image source={book.image} style={styles.bookImage}/>
                        <Text style={styles.bookTitle}>{book.title}</Text>
                        <Text style={styles.bookAuthor}>by {book.author}</Text>
                        {!showMyList && (
                            <Button title="Add to my list" onPress={() => addToList(book)} />
                        )}
                    </View>
                ))}
                {showMyList && myList.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
                        Your list is empty.
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#fff' 
    },
    myListButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 10,
    },
    myListButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bannerImage: {
        width: '100%', 
        height: 200
    },
    header: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    subheader: { 
        fontSize: 16, 
        color: '#666', 
        marginBottom: 30 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    bookList: { 
        flex: 1 
    },
    bookItem: {
        backgroundColor: '#f4f4f4',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    bookImage: {
        width: 60, 
        height: 90,
        resizeMode: 'cover',
        borderRadius: 5,
        marginRight: 15,
    },
    bookTitle: { 
        fontSize: 18, 
        fontWeight: 'bold' 
        },
    bookAuthor: { 
        fontSize: 14, 
        color: '#555' 
    },
    messageBox: {
        backgroundColor: '#d1e7dd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        alignSelf: 'center',
    },
    messageText: {
        color: '#0f5132',
        fontSize: 16,
        textAlign: 'center',
    },
});
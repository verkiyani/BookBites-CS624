import React, { useContext, useState, useEffect } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { MyListContext } from './_layout';
import { useRouter } from 'expo-router';

const API_BASE ='http://localhost:3000'

const Home = () => {
    const { myList, setMyList } = useContext(MyListContext);
    const router = useRouter();
    const [showMyList, setShowMyList] = useState(false);
    const [addedMessage, setAddedMessage] = useState('');
    const [bookExamples, setBookExamples] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/api/books`)
            .then(res => res.json())
            .then(data => setBookExamples(data))
            .catch(() => setBookExamples([]));
    }, []);

    const addToList = (book) => {
        if (!myList.some(item => item._id === book._id)) {
            setMyList([...myList, book]);
            setAddedMessage(`"${book.title}" has been added to your list.`);
            setTimeout(() => setAddedMessage(''), 1500);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.myListButton}
                onPress={() => router.push('/MyListScreen')}
            >
                <Text style={styles.myListButtonText}>My List</Text>
            </TouchableOpacity>

            {addedMessage !== '' && (
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>{addedMessage}</Text>
                </View>
            )}

            <Image
                source={require('../assets/images/books.jpg')}
                style={styles.bannerImage}
                resizeMode="contain"
            />
            <Text style={styles.header}>Welcome to BookBites</Text>
            <Text style={styles.subheader}>Discover and share the books you love.</Text>

            <Text style={styles.sectionTitle}>Popular Now</Text>

            <ScrollView style={styles.bookList}>
                {bookExamples.map(book => (
                    <TouchableOpacity
                        key={book._id}
                        style={styles.bookItem}
                        onPress={() => router.push({ pathname: '/BookDetailScreen', params: { book: JSON.stringify(book) } })}
                    >
                        <View style={styles.bookContent}>
                            <Image source={typeof book.image === 'string' ? { uri: book.image } : book.image} style={styles.bookImage}/>
                            <View style={styles.bookInfo}>
                                <Text style={styles.bookTitle}>{book.title}</Text>
                                <Text style={styles.bookAuthor}>by {book.author}</Text>
                                <Button 
                                    title="Add to my list" 
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        addToList(book);
                                    }} 
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Home;

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
        width: 300,
        height: 200,
        alignSelf: 'center',
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
    bookContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookInfo: {
        flex: 1,
        marginLeft: 15,
    },
    bookImage: {
        width: 60, 
        height: 90,
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
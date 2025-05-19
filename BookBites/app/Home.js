import React, {Component} from 'react'
import {View, Text, StyleSheet, ScrollView, Image, Button} from 'react-native';

const HomeScreen = () => {
    const bookExamples = [
    {id: 1, title: '1984', author: 'George Orwell', image: require('../assets/images/1984.jpg') }, 
    {id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', image: require('../assets/images/greatgatsby.jpg')},
    {id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', image: require('../assets/images/tokillamockingbird.png')},
]; 
    return (
        <View style={styles.container}>
            < Image
                source = {require('../assets/images/books.jpg')}
                style = {styles.bannerImage}/>
            <Text style={styles.header}>Welcome to BookBites</Text>
            <Text style={styles.subheader}>Discover and share the books you love.</Text>

            <Text style={styles.sectionTitle}>Popular Now</Text>

            <ScrollView style={styles.bookList}>
                {bookExamples.map(book => (
                    <View key={book.id} style={styles.bookItem}>
                        <Image source = {book.image} style = {styles.bookImage}/>
                        <Text style={styles.bookTitle}>{book.title}</Text>
                        <Text style={styles.bookAuthor}>by {book.author}</Text>
                        <Button title="Add to my list" onPress={() => {}} />
                    </View>
                ))}
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
});
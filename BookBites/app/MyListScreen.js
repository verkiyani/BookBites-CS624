import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const MyListScreen = ({ myList }) => (
    <View style={styles.container}>
        <Text style={styles.header}>My List</Text>
        {myList.length === 0 ? (
            <Text style={styles.emptyText}>Your list is empty.</Text>
        ) : (
            <ScrollView>
                {myList.map(book => (
                    <View key={book.id} style={styles.bookItem}>
                        <Image source={book.image} style={styles.bookImage}/>
                        <Text style={styles.bookTitle}>{book.title}</Text>
                        <Text style={styles.bookAuthor}>by {book.author}</Text>
                    </View>
                ))}
            </ScrollView>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    emptyText: { fontSize: 16, color: '#666', marginTop: 20 },
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
    bookTitle: { fontSize: 18, fontWeight: 'bold' },
    bookAuthor: { fontSize: 14, color: '#555' },
});

export default MyListScreen;
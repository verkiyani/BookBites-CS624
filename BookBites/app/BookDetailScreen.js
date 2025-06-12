import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_BASE = "http://localhost:3000"

const BookDetailScreen = () => {
    const params = useLocalSearchParams();
    const book = params.book ? JSON.parse(params.book) : {};
    const [rating, setRating] = React.useState('5');
    const [comment, setComment] = React.useState('');
    const [discussion, setDiscussion] = React.useState('');
    const [quote, setQuote] = React.useState('');
    const [pageNumber, setPageNumber] = React.useState('');
    const [comments, setComments] = React.useState([]);
    const [discussions, setDiscussions] = React.useState([]);
    const [quotes, setQuotes] = React.useState([]);

    // Fetch data from MongoDB on mount
    useEffect(() => {
        if (!book._id) return;
        fetch(`${API_BASE}/api/book/${book._id}/all`)
            .then(res => res.json())
            .then(data => {
                setComments(data.comments || []);
                setDiscussions(data.discussions || []);
                setQuotes(data.quotes || []);
            })
            .catch(() => {});
    }, [book._id]);

    const submitRating = async () => {
        const payload = { rating, comment, date: new Date().toLocaleDateString() };
        await fetch(`${API_BASE}/api/book/${book._id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        setComments([...comments, payload]);
        setComment('');
    };

    const submitDiscussion = async () => {
        const payload = { text: discussion, date: new Date().toLocaleDateString() };
        await fetch(`${API_BASE}/api/book/${book._id}/discussion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        setDiscussions([...discussions, payload]);
        setDiscussion('');
    };

    const submitQuote = async () => {
        const payload = { text: quote, page: pageNumber, date: new Date().toLocaleDateString() };
        await fetch(`${API_BASE}/api/book/${book._id}/quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        setQuotes([...quotes, payload]);
        setQuote('');
        setPageNumber('');
    };

    const deleteEntry = async (type, identifier) => {
        if (!book._id) return;
        await fetch(`${API_BASE}/api/book/${book._id}/${type}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(identifier),
        });
        if (type === 'comments') {
            setComments(comments.filter(
                (item) => !(item.date === identifier.date && item.comment === identifier.comment && item.rating === identifier.rating)
            ));
        } else if (type === 'discussion') {
            setDiscussions(discussions.filter(
                (item) => !(item.date === identifier.date && item.text === identifier.text)
            ));
        } else if (type === 'quote') {
            setQuotes(quotes.filter(
                (item) => !(item.date === identifier.date && item.text === identifier.text && item.page === identifier.page)
            ));
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.bookHeader}>
                <Image source={typeof book.image === 'string' ? { uri: book.image } : book.image} style={styles.bookImage} />
                <View style={styles.bookInfo}>
                    <Text style={styles.title}>{book.name}</Text>
                    <Text style={styles.author}>by {book.author}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rate & Review</Text>
                <Picker
                    selectedValue={rating}
                    onValueChange={setRating}
                    style={styles.picker}>
                    {[1,2,3,4,5].map(num => (
                        <Picker.Item key={num} label={`${num} stars`} value={String(num)} />
                    ))}
                </Picker>
                <TextInput
                    style={styles.input}
                    placeholder="Write your review..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />
                <Button title="Submit Review" onPress={submitRating} />
                <ScrollView style={{maxHeight: 200}}>
                    {comments.map((item, index) => (
                        <View key={index} style={styles.reviewItem}>
                            <Text>Rating: {item.rating} stars</Text>
                            <Text>{item.comment}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                            <Button
                                title="Delete"
                                color="#d9534f"
                                onPress={() => deleteEntry('comments', { date: item.date, comment: item.comment, rating: item.rating })}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Discussion</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Join the discussion..."
                    value={discussion}
                    onChangeText={setDiscussion}
                    multiline
                />
                <Button title="Post" onPress={submitDiscussion} />
                <ScrollView style={{maxHeight: 200}}>
                    {discussions.map((item, index) => (
                        <View key={index} style={styles.discussionItem}>
                            <Text>{item.text}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                            <Button
                                title="Delete"
                                color="#d9534f"
                                onPress={() => deleteEntry('discussion', { date: item.date, text: item.text })}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quotes</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter quote..."
                    value={quote}
                    onChangeText={setQuote}
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Page number"
                    value={pageNumber}
                    onChangeText={setPageNumber}
                    keyboardType="numeric"
                />
                <Button title="Add Quote" onPress={submitQuote} />
                <ScrollView style={{maxHeight: 200}}>
                    {quotes.map((item, index) => (
                        <View key={index} style={styles.quoteItem}>
                            <Text>"{item.text}"</Text>
                            <Text>Page: {item.page}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                            <Button
                                title="Delete"
                                color="#d9534f"
                                onPress={() => deleteEntry('quote', { date: item.date, text: item.text, page: item.page })}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    bookHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    bookImage: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    bookInfo: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 18,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        marginBottom: 10,
    },
    reviewItem: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginTop: 10,
    },
    discussionItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginTop: 10,
    },
    quoteItem: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginTop: 10,
    },
    date: {
        color: '#666',
        fontSize: 12,
        marginTop: 5,
    },
});

export default BookDetailScreen;

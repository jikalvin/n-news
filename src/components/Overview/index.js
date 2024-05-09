import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { Button, ButtonGroup, Card, Col, Form, Row } from 'react-bootstrap';

const Overview = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePublishToggle = async (articleId) => {
        try {
          const articleRef = doc(db, 'news', articleId);
          const updateData = {
            isCoverArticle: !articleRef.data().isCoverArticle,
          };
          await updateDoc(articleRef, updateData);
          console.log('Article published state updated successfully!');
        } catch (err) {
          console.error('Error updating article published state:', err);
        }
      };
      

    useEffect(() => {
        const fetchNewsArticles = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const newsRef = collection(db, 'news');
                const querySnapshot = await getDocs(newsRef);
                const articles = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNewsArticles(articles);
            } catch (err) {
                console.error('Error fetching news articles:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewsArticles();
    }, []);

    return (
        <div className="container mt-5">
            <h1>News Articles</h1>
            {isLoading && <p>Loading news articles...</p>}
            {error && <p className="text-danger">Error: {error}</p>}
            {!isLoading && newsArticles.length === 0 && <p>No news articles found.</p>}
            {!isLoading && newsArticles.length > 0 && (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {newsArticles.map((article) => (
                        <Col key={article.id}>
                            <Card>
                                <Card.Img variant="top" src={article.coverImage} alt={article.title} style={{padding: 15}} />
                                <Card.Body>
                                    <Card.Title>{article.title}</Card.Title>
                                    <Card.Text>{article.content.substring(0, 100)}...</Card.Text>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <ButtonGroup>
                                            <Button variant="primary" size="sm">
                                                Edit
                                            </Button>
                                            <Button variant="danger" size="sm">
                                                Delete
                                            </Button>
                                        </ButtonGroup>
                                        <Form.Check
                                            type="switch"
                                            id={`is-published-${article.id}`}
                                            label={article.isCoverArticle ? 'Cover Article' : 'Publish'}
                                            checked={article.isCoverArticle}
                                            onChange={() => handlePublishToggle(article.id)}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );

};

export default Overview;

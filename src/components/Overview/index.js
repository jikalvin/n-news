import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { Button, ButtonGroup, Card, Col, Form, Modal, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';

const Overview = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handlePublishToggle = async (articleId, currentState) => {
        try {
            const articleRef = doc(db, 'news', articleId);
            await updateDoc(articleRef, {
                isCoverArticle: !currentState,
            });
            setNewsArticles((prevArticles) =>
                prevArticles.map((article) =>
                    article.id === articleId ? { ...article, isCoverArticle: !currentState } : article
                )
            );
            setToastMessage('Article publish state updated successfully!');
            setShowToast(true);
        } catch (err) {
            console.error('Error updating article publish state:', err);
            setError('Failed to update publish state');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'news', selectedArticleId));
            setNewsArticles((prevArticles) =>
                prevArticles.filter((article) => article.id !== selectedArticleId)
            );
            setShowDeleteModal(false);
            setToastMessage('Article deleted successfully!');
            setShowToast(true);
        } catch (err) {
            console.error('Error deleting article:', err);
            setError('Failed to delete article');
        }
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const { id, title, content, coverImage } = editingArticle;

        try {
            const articleRef = doc(db, 'news', id);
            await updateDoc(articleRef, { title, content, coverImage });
            setNewsArticles((prevArticles) =>
                prevArticles.map((article) =>
                    article.id === id ? { ...article, title, content, coverImage } : article
                )
            );
            setShowEditModal(false);
            setToastMessage('Article updated successfully!');
            setShowToast(true);
        } catch (err) {
            console.error('Error updating article:', err);
            setError('Failed to update article');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditingArticle((prevArticle) => ({
            ...prevArticle,
            [name]: value,
        }));
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
            {isLoading && <Spinner animation="border" />}
            {error && <p className="text-danger">Error: {error}</p>}
            {!isLoading && newsArticles.length === 0 && <p>No news articles found.</p>}
            {!isLoading && newsArticles.length > 0 && (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {newsArticles.map((article) => (
                        <Col key={article.id}>
                            <Card className="h-100">
                                <Card.Img variant="top" src={article.coverImage} alt={article.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{article.title}</Card.Title>
                                    <Card.Text>{article.content.substring(0, 100)}...</Card.Text>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <ButtonGroup>
                                            <Button variant="primary" size="sm" onClick={() => handleEdit(article)}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => {
                                                setSelectedArticleId(article.id);
                                                setShowDeleteModal(true);
                                            }}>
                                                Delete
                                            </Button>
                                        </ButtonGroup>
                                        <Form.Check
                                            type="switch"
                                            id={`is-published-${article.id}`}
                                            label={article.isCoverArticle ? 'Published' : 'Publish'}
                                            checked={article.isCoverArticle}
                                            onChange={() => handlePublishToggle(article.id, article.isCoverArticle)}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            {editingArticle && (
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={editingArticle.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formContent" className="mt-3">
                                <Form.Label>Content</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="content"
                                    value={editingArticle.content}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCoverImage" className="mt-3">
                                <Form.Label>Cover Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="coverImage"
                                    value={editingArticle.coverImage}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this article?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Overview;

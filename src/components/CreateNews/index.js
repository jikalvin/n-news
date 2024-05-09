import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { auth, db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const AdminNewsForm = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [isCoverArticle, setIsCoverArticle] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const handleCoverArticleChange = (e) => {
    setIsCoverArticle(e.target.checked);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidated(true);
    setLoading(true);
    console.log(auth.currentUser)

    if (form.checkValidity() === false) {
      return;
    }

    try {
      let imageUrl;
      if (coverImage) {
        const imageRef = ref(storage, `news-covers/${coverImage.name}`);
        await uploadBytes(imageRef, coverImage);
        imageUrl = await getDownloadURL(imageRef);
        setCoverImageUrl(imageUrl);
        console.log(coverImageUrl)
      }

      const newsData = {
        title,
        category,
        content,
        coverImage: imageUrl,
        isCoverArticle,
        createdAt: serverTimestamp(),
      };

      console.log(newsData)

      const newsRef = collection(db, 'news');
      const { id } = await addDoc(newsRef, newsData);

      console.log('News article submitted successfully!', newsData, id); // Placeholder for now
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <Row>
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Create News Article</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter title" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a title for the news article.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <DropdownButton id="dropdown-category" title={category}>
                  <Dropdown.Item onClick={() => handleCategorySelect('General')}>General</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategorySelect('Business')}>Business</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategorySelect('Entertainment')}>Entertainment</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategorySelect('Entertainment')}>Health</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategorySelect('Entertainment')}>Science</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategorySelect('Entertainment')}>Sports</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategorySelect('Entertainment')}>Technology</Dropdown.Item>
                </DropdownButton>
              </Form.Group>
              <Form.Group controlId="coverImage">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control type="file" onChange={handleCoverImageChange} />
              </Form.Group>
              <Form.Group controlId="isCoverArticle">
                <Form.Check type="checkbox" label="Set as cover article" checked={isCoverArticle} onChange={handleCoverArticleChange} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicContent">
                <Form.Label>Content</Form.Label>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  placeholder="Enter content"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      // [{ size: ['small', false, 'large', 'huge'] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link', 'image', 'video'],
                      ['clean'],
                    ],
                  }}
                  formats={[
                    'header',
                    'size',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'list',
                    'bullet',
                    'align',
                    'link',
                    'image',
                    'video',
                  ]}
                  style={{ height: '300px' }} // Adjust the height here
                />
                <Form.Control.Feedback type="invalid">
                  Please provide content for the news article.
                </Form.Control.Feedback>
              </Form.Group>

              {errorMessage && <p className="text-danger mt-5">{errorMessage}</p>}
              <Button variant="primary" type="submit" className='mt-5'>
                {loading ? "Wait small..." : "Submit"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminNewsForm;

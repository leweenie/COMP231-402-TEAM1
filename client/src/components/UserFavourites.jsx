import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card, Pagination, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserFavourites = (props) => {

   const {userId, navProfiles} = props

   const [favourites, setFavourites] = useState([]);
   const [loadingFavourites, setLoadingFavourites] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   
   const favesPerPage = 6;
   const indexOfLastReview = currentPage * favesPerPage;
    const indexOfFirstReview = indexOfLastReview - favesPerPage;
    const currentFavourites = favourites.slice(indexOfFirstReview, indexOfLastReview);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(favourites.length / favesPerPage);

    const fetchFavourites = async () => {
      setLoadingFavourites(true);
      try {
          const response = await fetch(`http://localhost:5000/api/users/${userId}/favourites`);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setFavourites(data);
      } catch (error) {
          console.error("Error fetching favourites:", error);
      } finally {
          setLoadingFavourites(false);
      }
  };

   useEffect(() => {
           if (userId) {
            fetchFavourites();
           }
       }, [userId]);

   useEffect(() => {
           setCurrentPage(1);
       }, [favourites.length]);

   return (
      <div className="col-md-3">
         
         <div style={styles.reviewsListContainer}>
            <h3>Favourite Heroes</h3>
            {loadingFavourites ? (
                  <p>Loading reviews...</p>
            ) : favourites.length > 0 ? (
                  <>
                        <div className="mb-3 fave-image-container">
                        {currentFavourites.map((fave, i) => (
                           <div className='fave-image-box' key={i}>
                              <Image src={fave.profile.image} roundedCircle className='fave-image' onClick={() => navProfiles(fave._id)} />
                           {/* <Link to={`/user/${fave._id}`}>
                              <Image src={fave.profile.image} roundedCircle className='fave-image' />
                           </Link> */}
                        </div>
                            ))}
                        </div>

                     {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                              <Pagination>
                                 <Pagination.Prev 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                 />
                                 
                                 {Array.from({ length: totalPages }, (_, i) => (
                                    <Pagination.Item 
                                          key={i + 1} 
                                          active={currentPage === i + 1}
                                          onClick={() => paginate(i + 1)}
                                    >
                                          {i + 1}
                                    </Pagination.Item>
                                 ))}
                                 
                                 <Pagination.Next 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                 />
                              </Pagination>
                        </div>
                     )}
                  </>
            ) 
            : (
                  <p>No favourites yet.</p>
            )}
         </div>
      </div>
   )
}

const styles = {
   container: {
       color: '#333',
       padding: '20px',
       border: '1px solid #ddd',
       borderRadius: '10px',
       textAlign: 'center',
       width: '100%',
       margin: '0 0 20px 0',
       background: '#fff'
   },
   reviewContainer: {
       color: '#333',
       padding: '20px',
       border: '1px solid #ddd',
       borderRadius: '10px',
       width: '100%',
       marginBottom: '20px',
       background: '#fff'
   },
   reviewsListContainer: {
       color: '#333',
       padding: '20px',
       border: '1px solid #ddd',
       borderRadius: '10px',
       width: '100%',
       background: '#fff'
   },
   image: {
       borderRadius: '50%',
       width: '120px',
       height: '120px',
       marginBottom: '10px',
       objectFit: 'cover'
   },
   button: {
       padding: '10px 15px',
       marginTop: '10px',
       border: 'none',
       background: '#007bff',
       color: 'white',
       borderRadius: '5px',
       cursor: 'pointer'
   },
   starRating: {
       display: 'flex',
       alignItems: 'center'
   },
   reviewStars: {
       fontSize: '24px'
   }
};

export default UserFavourites
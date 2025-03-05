import { useGetTopPostQuery } from '../slices/blogPostApiSlice'
import Loader from '../components/Loader'
import Meassage from '../components/Meassage'
import { Image } from 'react-bootstrap'



const HomeBlog = () => {
const { data: posts, error, isLoading } = useGetTopPostQuery();

  if (isLoading) return <Loader />;
  if (error) return <Meassage variant='danger'>{error?.data?.message || error.error}</Meassage>;


  return (
    <div className='homeBlog'>
         {posts.map((post) =>(
        <div key={post._id} className="product-card">
        <h4>{post.title}</h4>
        <br />
        <Image src={post.images[0]} alt={post.title}className="product-image-homeBlog" fluid />
        <br />
        <br />
          
        <h5 style={{width:'85%'}}>{post.shortText}</h5>
      </div>
      ))}</div>
  )
}

export default HomeBlog
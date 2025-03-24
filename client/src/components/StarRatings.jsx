const StarRatings = (props) => {
   const {rating, count} = props
   // const rating = isNaN(_rating) ? 4.5 : _rating
   // const count = isNaN(_count) ? 2 : _count

   const getImage = () => {
      let value
      if (rating < 0.75) value = '/src/assets/stars/0-5.png'
      else if (rating < 1.25) value = '/src/assets/stars/1.png'
      else if (rating < 1.75) value = '/src/assets/stars/1-5.png'
      else if (rating < 2.25) value = '/src/assets/stars/2.png'
      else if (rating < 2.75) value = '/src/assets/stars/2-5.png'
      else if (rating < 3.25) value = '/src/assets/stars/3.png'
      else if (rating < 3.75) value = '/src/assets/stars/3-5.png'
      else if (rating < 4.25) value = '/src/assets/stars/4.png'
      else if (rating < 4.75) value = '/src/assets/stars/4-5.png'
      else value = '/src/assets/stars/5-0.png'
      return value
   }

   if (rating && count) return (
      <div><img src={`${getImage()}`}/> {`(${count})`}</div>
   )
}
export default StarRatings
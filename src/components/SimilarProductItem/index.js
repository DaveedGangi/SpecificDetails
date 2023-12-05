// Write your code here

import './index.css'

const SimilarProducts = props => {
  const {each} = props

  return (
    <li className="Li" key={each.id}>
      <div key={each.id}>
        <img className="bottomImage" src={each.image} alt={each.id} />
      </div>
      <p>{each.title}</p>
      <p>by {each.brand}</p>
      <div key={each.id}>
        <p>Rs {each.price}/-</p>
        <div>
          {each.rating}{' '}
          <img
            className="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProducts

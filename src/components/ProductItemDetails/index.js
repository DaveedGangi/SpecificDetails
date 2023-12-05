// Write your code here
import {Component} from 'react'

import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProducts from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    listOfData: {},
    listOfDataAll: [],
    apiStatus: apiStatusConstants.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        image: fetchedData.image_url,
        id: fetchedData.id,
        title: fetchedData.title,
        price: fetchedData.price,
        rating: fetchedData.rating,
        totalReviews: fetchedData.total_reviews,
        description: fetchedData.description,
        available: fetchedData.availability,
        brand: fetchedData.brand,
      }
      const totalAll = fetchedData.similar_products.map(each => ({
        id: each.id,
        image: each.image_url,
        title: each.title,
        brand: each.brand,
        price: each.price,
        rating: each.rating,
      }))
      this.setState({
        listOfData: updatedData,
        apiStatus: apiStatusConstants.success,
        listOfDataAll: totalAll,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  changeToMinus = () => {
    this.setState(preveState => ({count: preveState.count - 1}))
  }

  changeToPlus = () => {
    this.setState(preveState => ({count: preveState.count + 1}))
  }

  renderProductsListView = () => {
    const {listOfData, listOfDataAll, count} = this.state
    const {
      id,
      image,
      title,
      price,
      rating,
      totalReviews,
      description,
      available,
      brand,
    } = listOfData
    return (
      <div>
        <Header />
        <div className="bgCenter">
          <div>
            <div key={id}>
              <img className="imageTop" src={image} alt="product" />
            </div>
            <div>
              <h1>{title}</h1>
              <p>Rs {price}/-</p>
              <div>
                {rating}
                <img
                  className="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
                <p>{totalReviews} Reviews</p>
                <p>{description}</p>
                <p>Available: {available}</p>
                <p>Brand: {brand}</p>
                <div>
                  <div>
                    <button
                      onClick={this.changeToMinus}
                      type="button"
                      data-testid="minus"
                    >
                      <BsDashSquare /> -
                    </button>
                  </div>
                  <p>{count}</p>

                  <button
                    type="button"
                    onClick={this.changeToPlus}
                    data-testid="plus"
                  >
                    <BsPlusSquare />+
                  </button>
                </div>
                <button type="button">ADD TO CART</button>
              </div>
            </div>
          </div>
          <h1>Similar Products</h1>
          <ul className="flexBottom">
            {listOfDataAll.map(each => (
              <SimilarProducts each={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
          alt="failure view"
        />
      </div>
      <h1>Product Not Found</h1>
      <div>
        <Link to="/products">
          <button type="button">Continue Shopping</button>
        </Link>
      </div>
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return <div>{this.renderAllProducts()}</div>
  }
}

export default ProductItemDetails

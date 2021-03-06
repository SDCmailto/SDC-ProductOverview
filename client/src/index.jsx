const $ = require( "jquery" );
 const React = require('react');
 const ReactDOM = require('react-dom');
import OverviewWidget from './components/Overview/OverviewWidget.jsx';
import CartWidget from './components/Cart/CartWidget.jsx';

class Overview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product_name: '',
      package_name: '',
      list_price: null,
      price: null,
      save: null,
      save_pct: null,
      sellers: [],
      form: [],
      inventory: null,
      in_stock: null,
      ships_from: '',
      sold_by: '',
      director: '',
      actor1: '',
      actor2: '',
      rating: '',
      average: null,
      reviewcount: null
    }
  }
//
  componentDidMount() {

    // const productid = new URL(window.location).pathname.slice(4, );
    const productid = window.location.pathname;
    console.log(productid);
    $.ajax({
      url: 'http://54.151.82.224/overview' + productid,
      method: 'GET',
      success: (res) => {
        console.log('res', res);
        this.setState({
          product_name: res.product_name,
          package_name: res.package_name,
          list_price: res.list_price,
          price: res.price,
          save: res.list_price - res.price,
          save_pct: Math.round((res.list_price - res.price) / res.list_price * 100, 0),
          sellers: res.sellers,
          form: res.forms,
          in_stock: res.in_stock,
          ships_from: res.ships_from,
          sold_by: res.sold_by
        })
      },
      error: (error) => {
        console.log(error);
      }
    })

    $.ajax({
      url: "http://18.118.36.172:3000/Information" + productid,
      method: 'GET',
      success: (res) => {
        this.setState({
          actor1: res.cast[0],
          actor2: res.cast[1],
          director: res.cast[res.cast.length - 1],
          rating: res.rating
        })
      },
      error: (error) => {
        console.log(error);
      }
    })

    $.ajax({
      url: `${process.env.REVIEW_IP}` + productid,
      method: 'GET',
      success: (res) => {
        this.setState({
          average: res.averageReviews,
          reviewcount: res.totalReviews
        })
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <OverviewWidget
              product_name={this.state.product_name}
              actor1={this.state.actor1}
              actor2={this.state.actor2}
              director={this.state.director}
              rating={this.state.rating}
              average={this.state.average}
              reviewcount={this.state.reviewcount}
              package_name={this.state.package_name}
              price={this.state.price}
              list_price={this.state.list_price}
              save={this.state.save}
              save_pct={this.state.save_pct}
              sellers={this.state.sellers}
              forms={this.state.form}
            />
          </div>
          <div className="col-md-3">
            <CartWidget
              price={this.state.price}
              in_stock={this.state.in_stock}
              ships_from={this.state.ships_from}
              sold_by={this.state.sold_by}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default Overview;
if (typeof window !== 'undefined') {
ReactDOM.hydrate(<Overview />, document.getElementById("product-overview"));
}	
